import os
from langchain_openai import OpenAI


class LLMService:
    def __init__(self):
        self.llm = OpenAI(
            temperature=0.5,
            top_p=0.7,
            api_key=os.getenv("HF_TOKEN"), 
            base_url="https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1",
        )

    def summarize_text(self, text: str, lang: str) -> str:
            supported_languages = {"pt": "Portuguese", "en": "English", "es": "Spanish"}
            if lang not in supported_languages:
                raise ValueError("Language not supported", 400)

            target_language = supported_languages[lang]
            prompt = (
                f"First, summarize the following text {text} "
                f"Then, translate the summary into {target_language}:\n\n"
            )

            response = self.llm.invoke(prompt)
            return response
