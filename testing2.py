import os
import google.generativeai as genai

genai.configure(api_key="Api-E")

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 10000,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

chat_session = model.start_chat(
  history=[
  ]
)
a="As the world grapples with climate change, renewable energy sources are becoming increasingly vital, prompting an exploration of various aspects including technological innovations and policy implications. Recent advancements in solar energy technology, such as bifacial solar panels and perovskite cells, have significantly improved efficiency and reduced costs, making solar power more accessible. Meanwhile, government policies, such as tax incentives and renewable portfolio standards, play a crucial role in accelerating the adoption of wind energy by creating favorable market conditions. Considering a scenario where a country transitions to 100% renewable energy by 2050, potential challenges include the need for substantial infrastructure investment and grid modernization, while opportunities may arise in job creation and energy independence. A detailed analysis reveals that these advancements and policies are essential for overcoming barriers and maximizing the potential of renewable energy, ultimately contributing to a sustainable future.(answer in 1000 words)"
response = chat_session.send_message(a)

print(response.text)