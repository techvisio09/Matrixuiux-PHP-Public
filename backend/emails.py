"""Order fulfillment + transactional email via Resend.

If RESEND_API_KEY is empty, emails are stored in `email_outbox` with status
"queued" (visible in the admin panel) and sent later once a key is configured.
License keys are auto-assigned from the `license_keys` inventory; items without
available keys are flagged so the email tells the customer keys follow shortly.
"""
import asyncio
import logging
import os
from datetime import datetime, timezone

import resend

from database import db

logger = logging.getLogger(__name__)

COMPANY_NAME = "UCODE SOFTTECH LLC"
SUPPORT_PHONE = "1-888-632-9902"
SUPPORT_EMAIL = "Reachout@ucodesofttechus.com"
SUPPORT_HOURS = "Mon-Sat, 9 AM - 6 PM EST"


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------- key assignment
async def assign_license_keys(order: dict) -> list:
    """Assign one available key per unit for each product item. Returns
    [{product_id, name, image, key|None}] — one entry per unit."""
    assignments = []
    for item in order["items"]:
        if item["id"] == "proassist-premium":
            continue
        for _ in range(int(item["qty"])):
            key_doc = await db.license_keys.find_one_and_update(
                {"product_id": item["id"], "status": "available"},
                {"$set": {"status": "assigned", "order_id": order["order_id"],
                          "order_number": order["order_number"], "assigned_at": _now_iso()}},
            )
            assignments.append({
                "product_id": item["id"],
                "name": item["name"],
                "image": item.get("image"),
                "key": key_doc["key"] if key_doc else None,
            })
    return assignments


# ---------------------------------------------------------------- email HTML
def _key_block(key):
    if key:
        return f'''<div style="margin-top:12px;border:2px dashed #2563eb;border-radius:10px;background:#eff6ff;padding:14px 16px;text-align:center;">
          <div style="font-size:11px;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">Your Product Key</div>
          <div style="font-family:'Courier New',monospace;font-size:18px;font-weight:bold;color:#1d4ed8;letter-spacing:2px;">{key}</div>
        </div>'''
    return '''<div style="margin-top:12px;border:1px solid #fcd34d;border-radius:10px;background:#fffbeb;padding:12px 16px;">
      <div style="font-size:13px;color:#92400e;"><strong>Your product key is being prepared</strong> and will arrive in a separate email within 30 minutes.</div>
    </div>'''


def build_order_email_html(order: dict, assignments: list) -> str:
    first_name = order.get("customer", {}).get("first_name") or "there"
    items_html = ""
    for a in assignments:
        img = f'<img src="{a["image"]}" width="84" height="84" alt="" style="display:block;border-radius:8px;background:#f8fafc;object-fit:contain;">' if a.get("image") else ""
        items_html += f'''
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;margin-bottom:14px;">
          <tr>
            <td style="padding:16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td width="96" valign="top">{img}</td>
                <td valign="top" style="padding-left:8px;">
                  <div style="font-size:15px;font-weight:bold;color:#0f172a;line-height:1.35;">{a["name"]}</div>
                  <div style="font-size:12px;color:#64748b;margin-top:4px;">Genuine lifetime license &middot; 1 device</div>
                </td>
              </tr></table>
              {_key_block(a.get("key"))}
            </td>
          </tr>
        </table>'''

    pro_html = ""
    if order.get("pro_assist"):
        pro_html = '''<div style="border:1px solid #c7d2fe;background:#eef2ff;border-radius:10px;padding:12px 16px;margin-bottom:14px;font-size:13px;color:#3730a3;">
          <strong>ProAssist Premium Installation included</strong> — our team will contact you within the same business day to remotely install your software.</div>'''

    return f'''<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f1f5f9;font-family:Segoe UI,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:28px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08);">
  <tr><td style="background:#0f172a;padding:24px 32px;">
    <table role="presentation" width="100%"><tr>
      <td><div style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:.5px;">UCODE <span style="color:#60a5fa;">SOFTTECH</span></div>
      <div style="font-size:10px;color:#94a3b8;letter-spacing:2px;">AUTHORIZED MICROSOFT RESELLER</div></td>
      <td align="right"><div style="display:inline-block;background:#16a34a;color:#fff;font-size:11px;font-weight:bold;border-radius:999px;padding:6px 14px;">&#10003; ORDER CONFIRMED</div></td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:32px;">
    <h1 style="margin:0 0 6px;font-size:22px;color:#0f172a;">Thank you for your purchase, {first_name}!</h1>
    <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">Your payment was successful and your genuine Microsoft license is ready. Below you'll find your product key(s) and simple activation steps.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;margin-bottom:22px;"><tr>
      <td style="padding:14px 18px;font-size:13px;color:#475569;">Order Number<br><strong style="color:#0f172a;font-size:15px;">#{order["order_number"]}</strong></td>
      <td style="padding:14px 18px;font-size:13px;color:#475569;">Order Total<br><strong style="color:#0f172a;font-size:15px;">${order["total"]:.2f} USD</strong></td>
      <td style="padding:14px 18px;font-size:13px;color:#475569;">Delivered To<br><strong style="color:#0f172a;font-size:14px;">{order["email"]}</strong></td>
    </tr></table>
    {pro_html}
    {items_html}
    <h2 style="font-size:15px;color:#0f172a;margin:24px 0 10px;">How to activate</h2>
    <ol style="margin:0;padding-left:20px;font-size:13px;color:#475569;line-height:2;">
      <li>Download the official installer from <a href="https://setup.office.com" style="color:#2563eb;">setup.office.com</a> (or the link for your product).</li>
      <li>Sign in (or create a free Microsoft account) and enter your product key when prompted.</li>
      <li>Follow the on-screen steps — your license activates instantly.</li>
    </ol>
    <div style="margin-top:22px;border-top:1px solid #e2e8f0;padding-top:16px;font-size:12px;color:#64748b;line-height:1.7;">
      <strong style="color:#0f172a;">Billing note:</strong> this charge will appear as <strong>{COMPANY_NAME}</strong> on your card statement.
    </div>
  </td></tr>
  <tr><td style="background:#f8fafc;padding:22px 32px;border-top:1px solid #e2e8f0;">
    <div style="font-size:13px;font-weight:bold;color:#0f172a;margin-bottom:6px;">Need help installing?</div>
    <div style="font-size:12px;color:#64748b;line-height:1.8;">
      &#128222; <a href="tel:{SUPPORT_PHONE}" style="color:#2563eb;text-decoration:none;">{SUPPORT_PHONE}</a> ({SUPPORT_HOURS})<br>
      &#9993;&#65039; <a href="mailto:{SUPPORT_EMAIL}" style="color:#2563eb;text-decoration:none;">{SUPPORT_EMAIL}</a> &middot; Free installation &amp; activation assistance included
    </div>
    <div style="margin-top:14px;font-size:11px;color:#94a3b8;">&copy; {datetime.now().year} {COMPANY_NAME}. All rights reserved.</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>'''


# ---------------------------------------------------------------- sending
async def send_email(to: str, subject: str, html: str, kind: str = "order_confirmation", order_id: str = None) -> dict:
    record = {
        "to": to, "subject": subject, "html": html, "kind": kind,
        "order_id": order_id, "created_at": _now_iso(),
    }
    api_key = os.environ.get("RESEND_API_KEY", "")
    if not api_key:
        record["status"] = "queued"
        record["note"] = "RESEND_API_KEY not configured — email stored for later delivery"
        await db.email_outbox.insert_one(dict(record))
        logger.info(f"Email QUEUED (no Resend key) to {to}: {subject}")
        return record
    try:
        resend.api_key = api_key
        params = {"from": os.environ.get("SENDER_EMAIL", "onboarding@resend.dev"),
                  "to": [to], "subject": subject, "html": html}
        result = await asyncio.to_thread(resend.Emails.send, params)
        record["status"] = "sent"
        record["resend_id"] = result.get("id")
    except Exception as e:
        logger.error(f"Resend send failed: {e}")
        record["status"] = "failed"
        record["note"] = str(e)
    await db.email_outbox.insert_one(dict(record))
    return record


async def fulfill_order(order_id: str):
    """Assign license keys and send the confirmation email. Idempotent."""
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order or order.get("fulfilled"):
        return
    assignments = await assign_license_keys(order)
    await db.orders.update_one({"order_id": order_id}, {"$set": {
        "fulfilled": True,
        "license_keys": [{"product_id": a["product_id"], "name": a["name"], "key": a["key"]} for a in assignments],
        "fulfilled_at": _now_iso(),
    }})
    html = build_order_email_html(order, assignments)
    await send_email(order["email"], f"Your Microsoft product key — Order #{order['order_number']}",
                     html, order_id=order_id)
    logger.info(f"Order {order['order_number']} fulfilled ({len(assignments)} key slots)")
