import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? "Mahafaly Rent <onboarding@resend.dev>"

function base(content: string) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f0;margin:0;padding:32px 16px}
    .card{background:#fff;border-radius:16px;border:1px solid #e5e5e0;max-width:520px;margin:0 auto;overflow:hidden}
    .header{background:#1a1a1a;padding:28px 32px;color:#fff}
    .header h1{margin:0;font-size:18px;font-weight:700;letter-spacing:-0.3px}
    .header p{margin:4px 0 0;font-size:12px;color:#aaa}
    .body{padding:32px}
    .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0ec;font-size:13px}
    .row:last-child{border-bottom:none}
    .label{color:#888;font-weight:500}
    .value{color:#1a1a1a;font-weight:600}
    .badge{display:inline-block;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700;background:#f0fdf4;color:#166534}
    .footer{padding:20px 32px;background:#f5f5f0;font-size:11px;color:#aaa;text-align:center}
    h2{font-size:15px;color:#1a1a1a;margin:0 0 16px}
  </style></head><body><div class="card">${content}</div></body></html>`
}

interface BookingEmailData {
  userName: string
  userEmail: string
  carName: string
  startDate: string
  endDate: string
  totalPrice: string
  bookingId: string
}

export async function sendBookingConfirmationToUser(data: BookingEmailData) {
  if (!process.env.RESEND_API_KEY) return
  const html = base(`
    <div class="header"><h1>Mahafaly Rent</h1><p>Confirmation de réservation</p></div>
    <div class="body">
      <h2>Bonjour ${data.userName}, votre demande a été reçue !</h2>
      <div class="row"><span class="label">Véhicule</span><span class="value">${data.carName}</span></div>
      <div class="row"><span class="label">Début</span><span class="value">${data.startDate}</span></div>
      <div class="row"><span class="label">Fin</span><span class="value">${data.endDate}</span></div>
      <div class="row"><span class="label">Total</span><span class="value">${data.totalPrice}</span></div>
      <div class="row"><span class="label">Statut</span><span class="badge">En attente de confirmation</span></div>
      <p style="font-size:13px;color:#666;margin-top:20px">Nous confirmerons votre réservation sous 24h. Vous recevrez un email dès que votre demande est traitée.</p>
    </div>
    <div class="footer">Mahafaly Rent · Madagascar</div>
  `)
  await resend.emails.send({ from: FROM, to: data.userEmail, subject: `Réservation reçue — ${data.carName}`, html }).catch(() => {})
}

export async function sendNewBookingToAdmin(data: BookingEmailData, adminEmail: string) {
  if (!process.env.RESEND_API_KEY || !adminEmail) return
  const html = base(`
    <div class="header"><h1>Mahafaly Rent</h1><p>Nouvelle réservation</p></div>
    <div class="body">
      <h2>Nouvelle demande de réservation</h2>
      <div class="row"><span class="label">Client</span><span class="value">${data.userName}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">${data.userEmail}</span></div>
      <div class="row"><span class="label">Véhicule</span><span class="value">${data.carName}</span></div>
      <div class="row"><span class="label">Début</span><span class="value">${data.startDate}</span></div>
      <div class="row"><span class="label">Fin</span><span class="value">${data.endDate}</span></div>
      <div class="row"><span class="label">Total</span><span class="value">${data.totalPrice}</span></div>
    </div>
    <div class="footer">Connectez-vous au dashboard admin pour approuver ou refuser.</div>
  `)
  await resend.emails.send({ from: FROM, to: adminEmail, subject: `Nouvelle réservation — ${data.carName} (${data.userName})`, html }).catch(() => {})
}

export async function sendBookingStatusUpdate(data: BookingEmailData & { status: string }) {
  if (!process.env.RESEND_API_KEY) return
  const isApproved = data.status === "APPROVED"
  const isCancelled = data.status === "CANCELLED"
  if (!isApproved && !isCancelled) return

  const badgeStyle = isApproved
    ? "background:#f0fdf4;color:#166534"
    : "background:#fef2f2;color:#991b1b"
  const label = isApproved ? "Approuvée" : "Annulée"
  const subject = isApproved
    ? `Réservation approuvée — ${data.carName}`
    : `Réservation annulée — ${data.carName}`
  const message = isApproved
    ? "Votre réservation a été approuvée ! Vous pouvez contacter notre équipe pour finaliser les détails."
    : "Votre réservation a malheureusement été annulée. N'hésitez pas à nous contacter pour plus d'informations."

  const html = base(`
    <div class="header"><h1>Mahafaly Rent</h1><p>Mise à jour de réservation</p></div>
    <div class="body">
      <h2>Bonjour ${data.userName}</h2>
      <div class="row"><span class="label">Véhicule</span><span class="value">${data.carName}</span></div>
      <div class="row"><span class="label">Début</span><span class="value">${data.startDate}</span></div>
      <div class="row"><span class="label">Fin</span><span class="value">${data.endDate}</span></div>
      <div class="row"><span class="label">Total</span><span class="value">${data.totalPrice}</span></div>
      <div class="row"><span class="label">Statut</span><span class="badge" style="${badgeStyle}">${label}</span></div>
      <p style="font-size:13px;color:#666;margin-top:20px">${message}</p>
    </div>
    <div class="footer">Mahafaly Rent · Madagascar</div>
  `)
  await resend.emails.send({ from: FROM, to: data.userEmail, subject, html }).catch(() => {})
}
