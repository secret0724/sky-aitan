import { supabase } from './supabase'

export const fetchChats = async (id_user: string) => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('id_user', id_user)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createChat = async (id_user: string) => {
  const welcomeMsg = {
    sender: 'ai',
    text: 'Halo, aku SkyAiTan! Ada yang bisa aku bantu?',
    timestamp: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('chats')
    .insert({
      id_user,
      title: 'Chat Baru',
      messages: [welcomeMsg]
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateChatMessages = async (id_chat: string, messages: any) => {
  const { error } = await supabase
    .from('chats')
    .update({ messages, updated_at: new Date().toISOString() })
    .eq('id_chat', id_chat)
  if (error) throw error
}

export const renameChat = async (id_chat: string, newTitle: string) => {
  const { error } = await supabase
    .from('chats')
    .update({ title: newTitle, updated_at: new Date().toISOString() })
    .eq('id_chat', id_chat)
  if (error) throw error
}

export const deleteChat = async (id_chat: string) => {
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id_chat', id_chat)
  if (error) throw error
}
