// Utility for logging user prompts to the database

interface PromptLogData {
  originalPrompt: string;
  enhancedPrompt?: string;
  revisedPrompt?: string;
  style: string;
  productColor: string;
  quality?: string;
  success: boolean;
  errorMessage?: string;
  imageUrl?: string;
}

// Generate a session ID for anonymous users
function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem('user_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_session_id', sessionId);
  }
  
  return sessionId;
}

export async function logPromptToDatabase(data: PromptLogData): Promise<void> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const apiUrl = `${supabaseUrl}/functions/v1/save-prompt`;
    const userSession = getOrCreateSessionId();

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        ...data,
        userSession,
      }),
    });

    if (!response.ok) {
      console.error('Failed to log prompt:', response.statusText);
    } else {
      console.log('Prompt logged successfully');
    }
  } catch (error) {
    console.error('Error logging prompt:', error);
  }
}

// Get user's prompt history
export async function getUserPromptHistory(): Promise<PromptLogData[]> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const userSession = getOrCreateSessionId();
    
    const response = await fetch(`${supabaseUrl}/rest/v1/user_prompts?user_session=eq.${userSession}&order=created_at.desc`, {
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to fetch prompt history:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching prompt history:', error);
    return [];
  }
}