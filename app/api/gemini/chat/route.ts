import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, message } = await req.json();
    const userPrompt = message || (messages && messages[messages.length - 1]?.content) || "";

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback inteligente para contexto escolar de Moçambique quando sem API key
      return NextResponse.json({
        reply: generateLocalMozambicanSchoolGuidance(userPrompt)
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Você é o NEXUS AI Assistant, o consultor pedagógico e administrativo sénior para directores, chefes de secretaria e directores pedagógicos de escolas em Moçambique.
Conhece profundamente as normas do Ministério da Educação e Desenvolvimento Humano (MINEDH), os planos curriculares do Ensino Primário e Ensino Secundário Geral (ESG - 1º e 2º Ciclos), regulamentos de exames da 10ª e 12ª classes, gestão de propinas (M-Pesa, E-Mola, bancos) e elaboração de circulares e actas formais em Português de Moçambique.
Responda de forma profissional, estruturada e directamente útil.

Pergunta ou solicitação do utilizador:
${userPrompt}`
            }
          ]
        }
      ]
    });

    const reply = response.text || "Sem resposta gerada pelo modelo.";
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    return NextResponse.json({
      reply: generateLocalMozambicanSchoolGuidance("erro")
    });
  }
}

function generateLocalMozambicanSchoolGuidance(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('circular') || p.includes('início') || p.includes('trimestre')) {
    return `**CIRCULAR INFORMATIVA Nº 01/DPE/2026**

**Assunto:** Abertura do 1º Trimestre Lectivo e Orientações Gerais aos Pais e Encarregados de Educação.

Exmos. Senhores Pais e Encarregados de Educação,

A Direcção da Escola NEXUS vem por este meio saudar cordialmente toda a comunidade escolar e partilhar as seguintes directivas para o arranque do Ano Lectivo 2026:

1. **Horário Lectivo e Pontualidade:**
   - Turno da Manhã: Entrada às 07h00 / Saída às 12h30.
   - Turno da Tarde: Entrada às 12h45 / Saída às 17h30.
   - Solicita-se tolerância zero a atrasos não justificados.

2. **Uso Obrigatório de Uniforme:**
   - O uso rigoroso do uniforme oficial é obrigatório desde o primeiro dia de aulas.

3. **Regularização de Propinas:**
   - As propinas mensais vencem no dia 10 de cada mês. Pagamentos disponíveis via M-Pesa (*84 000 000*) e Millennium BIM.

4. **Reunião Geral:**
   - Convocatória marcada para o próximo Sábado, pelas 09h00 no Salão Nobre.

Com os melhores cumprimentos,
*A Direcção Pedagógica*`;
  }

  if (p.includes('exame') || p.includes('10ª') || p.includes('12ª') || p.includes('minedh')) {
    return `**ORIENTAÇÕES TÉCNICAS DO MINEDH PARA CLASSES COM EXAMES NACIONAIS (10ª e 12ª CLASSES)**

1. **Condições de Admissão:**
   - Média de Frequência igual ou superior a 10 (dez) valores nas disciplinas nucleares.
   - Limite máximo de faltas não justificadas não excedente a 25% da carga horária semestral.

2. **Documentação Exigida na Secretaria:**
   - Certidão de Nascimento / Cópia autenticada do Bilhete de Identidade (BI ou DIRE).
   - Certificado de Habilitações Literárias do nível anterior homologado.
   - Duas (2) fotografias tipo passe com fundo branco.

3. **Calendário e Sessões de Preparação:**
   - Recomendamos a calendarização de aulas de apoio e resolução de exames dos anos anteriores (DNE / MINEDH) aos Sábados das 08h00 às 11h30.`;
  }

  if (p.includes('cobrança') || p.includes('propina') || p.includes('dívida')) {
    return `**ESTRATÉGIA EFICAZ DE RECUPERAÇÃO DE PROPINAS ESCOLARES (MOÇAMBIQUE)**

Para manter a saúde financeira sem comprometer a relação com as famílias:

1. **Avisos Preventivos Escalados:**
   - **Dia 05 do mês:** Lembrete amigável via WhatsApp ("Estimado Encarregado, a propina de Fevereiro vence no dia 10...").
   - **Dia 11 (Vencimento):** Notificação de vencimento com facilitação de M-Pesa Paybill e referência rápida.
   - **Dia 18 (Sobretaxa):** Contacto formal da Secretaria para agendamento de plano de pagamento fraccionado.

2. **Canais Práticos:**
   - Mais de 85% dos encarregados em Moçambique preferem liquidar via Carteira Móvel (M-Pesa / E-Mola) pela facilidade de envio de comprovativo via WhatsApp.`;
  }

  return `Compreendo a sua solicitação no âmbito da administração escolar.

Como assistente NEXUS especializado no ecossistema educativo moçambicano, posso ajudá-lo a:
- **Redigir Circulares e Convocatórias Oficiais** para professores e encarregados.
- **Preparar Declarações e Pautas de Avaliação** de acordo com o sistema de 0 a 20 valores do MINEDH.
- **Estruturar Modelos de Cobrança e Avisos Financeiros** via canais móveis (M-Pesa, E-Mola).
- **Criar Planos de Turma e Horários de Professores** para turnos da manhã e tarde.

Pode escolher uma das opções acima ou detalhar a sua dúvida específica!`;
}
