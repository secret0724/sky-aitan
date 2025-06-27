import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

export const registerUser = async (email: string, password: string) => {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password: hashedPassword }])

  if (error) throw new Error(error.message)
  return data
}

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) throw new Error('Email tidak ditemukan')

  const passwordMatch = await bcrypt.compare(password, data.password)
  if (!passwordMatch) throw new Error('Password salah')

  return data
}
