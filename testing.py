# import google.generativeai as genai

# def check_api_status():
#     """Checks the status of the Gemini API.

#     Returns:
#         True if the API is working, False otherwise.
#     """

#     try:
#         # Replace 'YOUR_API_KEY' with your actual API key
#         genai.configure(api_key='AIzaSyDOAACsTHkn8-sU8w7mZLGWwmXHHZ7Wyk8')
#         model = genai.GenerativeModel("gemini-1.5-flash")
#         response = model.generate_text("Hello, world!")
#         return True
#     except Exception as e:
#         print(f"Error: {e}")
#         return False

# if __name__ == "__main__":
#     if check_api_status():
#         print("Gemini API is working!")
#     else:
#         print("Gemini API is not working.")


import google.generativeai as genai

def generate_text(model_name="models/text-bison"):
  """Generates text using the Gemini API.

  Args:
      model_name: (Optional) The name of the model to use.

  Returns:
      The generated text.
  """

  try:
      # Replace 'YOUR_API_KEY' with your actual API key
      genai.configure(api_key='AIzaSyCWvS1FGJoWUWjWJPoCTHLPGfT3AtMoRzE')
      model = genai.GenerativeModel(model_name=model_name)
      prompt = "What is the meaning of life?"
      response = model.generate_content(messages=[{"role": "user", "content": prompt}])
      return response.candidates[0].output
  except Exception as e:
      print(f"Error: {e}")
      return None

if __name__ == "__main__":
  generated_text = generate_text()
  if generated_text:
      print(generated_text)
  else:
      print("Failed to generate text.")