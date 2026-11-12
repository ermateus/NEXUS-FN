'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendSchoolRegistrationEmail } from '@/lib/email';

/**
 * Server Action dedicada para validar a unicidade do NUIT no registo da escola.
 * Consulta a tabela 'schools' no Supabase antes de prosseguir com a inserção.
 */
export async function validarNuitUnico(nuit: string): Promise<{ available: boolean; error?: string }> {
  const supabase = await createClient();

  if (!nuit || nuit.length !== 9 || !/^\d+$/.test(nuit)) {
    return { available: false, error: 'O NUIT deve conter exatamente 9 dígitos numéricos.' };
  }

  const { data: existingSchool, error } = await supabase
    .from('schools')
    .select('id, nome')
    .eq('nuit', nuit)
    .maybeSingle();

  if (error) {
    return { available: false, error: 'Erro ao verificar NUIT no sistema: ' + error.message };
  }

  if (existingSchool) {
    return { 
      available: false, 
      error: `O NUIT ${nuit} já se encontra registado pela instituição "${existingSchool.nome}". Cada escola deve possuir um NUIT único.` 
    };
  }

  return { available: true };
}

/**
 * Server Action 'validateNUIT' exigida para verificação estruturada do NUIT.
 */
export async function validateNUIT(nuit: string): Promise<{ success: boolean; exists: boolean; message?: string }> {
  const result = await validarNuitUnico(nuit);
  return {
    success: true,
    exists: !result.available,
    message: result.error
  };
}

export async function registerSchool(formData: any) {
  const supabase = await createClient();

  const email = formData.email;
  const password = formData.password;
  const schoolName = formData.schoolName;
  const nuit = formData.nuit;
  const niveisEnsino = formData.niveisEnsino;
  const provincia = formData.provincia;
  const distrito = formData.distrito;
  const endereco = formData.endereco;
  const representante = formData.representante;
  const telefone = formData.telefone;

  // 1. Validar unicidade do NUIT através da Server Action dedicada
  const nuitValidation = await validarNuitUnico(nuit);
  if (!nuitValidation.available) {
    return { error: nuitValidation.error };
  }

  // 2. Sign up user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome: representante,
      },
    },
  });

  if (authError) {
    return { error: 'Erro ao criar conta de utilizador: ' + authError.message };
  }

  const userId = authData.user?.id;
  if (!userId) {
    return { error: 'Erro ao criar utilizador.' };
  }

  // 3. Create school
  const { data: schoolData, error: schoolError } = await supabase
    .from('schools')
    .insert([
      {
        nome: schoolName,
        nuit,
        niveis_ensino: niveisEnsino,
        provincia,
        distrito,
        endereco,
        representante,
        telefone,
        email,
      },
    ])
    .select()
    .single();

  if (schoolError) {
    return { error: 'Erro ao criar registo da escola: ' + schoolError.message };
  }

  const schoolId = schoolData.id;

  // 4. Create profile
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: userId,
      school_id: schoolId,
      nome: representante,
    },
  ]);

  if (profileError) {
    return { error: 'Erro ao criar perfil de utilizador: ' + profileError.message };
  }

  // 5. Create user role
  const { error: roleError } = await supabase.from('user_roles').insert([
    {
      user_id: userId,
      role: 'admin_escola',
    },
  ]);

  if (roleError) {
    return { error: 'Erro ao atribuir papel administrativo: ' + roleError.message };
  }

  // 6. Send automated registration confirmation email via Resend
  try {
    await sendSchoolRegistrationEmail(email, schoolName, representante);
  } catch (err) {
    console.error('Error sending registration email:', err);
  }

  revalidatePath('/dashboard', 'layout');
  return { success: true };
}
