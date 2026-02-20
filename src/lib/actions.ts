"use client"

// In a real project, this would be a server action in a separate file with 'use server'
// But for this demonstration, we'll simulate the behavior with a client-side action
// to avoid any server-side environment issues during the initial build.

export async function submitContactForm(formData: FormData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  }
  
  console.log("Form submitted:", data)
  
  return {
    success: true,
    message: "Thank you! Your message has been sent successfully."
  }
}
