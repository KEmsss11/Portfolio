"use server"

/**
 * Server action to handle contact form submissions via Web3Forms.
 * This sends an email to kemuelpaulnalagon@gmail.com
 */
export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name")
    const email = formData.get("email")
    const message = formData.get("message")

    // Construct the data object
    const data = {
      access_key: "f753995f-c354-4b1b-9b81-9ed45ffe217f",
      name: name,
      email: email,
      message: message,
      subject: `New Portfolio Message from ${name}`,
      from_name: "Portfolio Robot"
    }

    console.log("Submitting to Web3Forms:", { ...data, access_key: "***" })

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })

    const status = response.status
    const contentType = response.headers.get("content-type")
    
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json()
      console.log("Web3Forms Response:", result)
      
      if (result.success) {
        return { success: true, message: "Success" }
      } else {
        return { success: false, message: result.message || `Submission failed (Status: ${status})` }
      }
    } else {
      const text = await response.text()
      console.error(`Web3Forms Non-JSON Error (Status ${status}):`, text)
      
      let errorMessage = "The email service returned an unexpected response."
      if (status === 403) {
        errorMessage = "Permission Denied (403). Please ensure your Web3Forms access key is correct and your email is verified."
      }
      
      return { 
        success: false, 
        message: `${errorMessage} (Status: ${status})`
      }
    }
  } catch (error: any) {
    console.error("Form submission error:", error)
    return {
      success: false,
      message: error.message || "An unexpected error occurred. Please try again later."
    }
  }
}
