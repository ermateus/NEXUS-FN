import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key');

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email simulation to:', to, subject);
      return { success: true, simulated: true };
    }

    const data = await resend.emails.send({
      from: 'NEXUS Enterprise <suporte@nexus.ac.mz>',
      to: [to],
      subject,
      html,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending email via Resend:', error);
    return { success: false, error: error.message };
  }
}

export async function sendSchoolRegistrationEmail(to: string, schoolName: string, representante: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a; text-align: center;">Bem-vindo ao NEXUS Enterprise</h2>
      <p>Olá <strong>${representante}</strong>,</p>
      <p>A escola <strong>${schoolName}</strong> foi registada com sucesso na plataforma NEXUS Enterprise - Sistema Integrado de Gestão Escolar.</p>
      <p>O seu espaço multi-tenant está ativo e seguro. Pode agora iniciar sessão com as suas credenciais para gerir alunos, professores, turmas e tesouraria.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.APP_URL || 'https://ais-dev-dt3y5cmrsnjdop7w743rnq-514341743907.europe-west2.run.app'}/login" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Aceder ao Sistema</a>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b; text-align: center;">NEXUS Enterprise © 2026. Suporte: +258 87 602 6638 | mocambiquenexus@gmail.com</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Registo Concluído - ${schoolName} | NEXUS Enterprise`,
    html,
  });
}

export async function sendPaymentNotificationEmail(to: string, alunoNome: string, valor: number, mes: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #059669; text-align: center;">Confirmação de Pagamento de Propina</h2>
      <p>Recebemos o pagamento da propina referente a <strong>${mes}</strong> do aluno <strong>${alunoNome}</strong>.</p>
      <p style="font-size: 18px; font-weight: bold; color: #0f172a;">Valor: ${valor.toLocaleString('pt-MZ')} MT</p>
      <p>Obrigado por manter as contribuições escolares regularizadas.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b; text-align: center;">NEXUS Enterprise © 2026. Moçambique</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Recibo de Propina - ${alunoNome} (${mes}) | NEXUS`,
    html,
  });
}
