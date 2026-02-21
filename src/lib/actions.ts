"use server"

/**
 * Server action to handle contact form submissions via Web3Forms.
 * This sends an email to kemuelpaulnalagon@gmail.com
 */
export async function submitContactForm(formData: FormData) {
  try {
    // Add the access key for Web3Forms (this is a public key for kemuelpaulnalagon@gmail.com)
    // The user can also get their own key at https://web3forms.com/
    formData.append("access_key", "96599e69-9060-449d-b895-cd27cc6e32d5") 
    formData.append("subject", `New Portfolio Message from ${formData.get("name")}`)
    formData.append("from_name", "Portfolio Robot")

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })

    const result = await response.json()

    if (result.success) {
      return {
        success: true,
        message: "Thank you! Your message has been sent successfully."
      }
    } else {
      throw new Error(result.message || "Something went wrong")
    }
  } catch (error) {
    console.error("Form submission error:", error)
    return {
      success: false,
      message: "An error occurred while sending your message. Please try again later."
    }
  }
}
