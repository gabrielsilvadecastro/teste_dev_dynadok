import sys
from dotenv import load_dotenv

load_dotenv()
sys.path = sys.path + ["./app"]

from fastapi import FastAPI
from pydantic import BaseModel
from services.llm_service import LLMService


title_project = "API Summarize Text"
description_project = "Webservice destinado a realizar resumos de textos."
contact_project={
    "name": "Gabriel Silva de Castro",
    "url": "https://github.com/gabrielsilvadecastro/teste_dev_dynadok",
    "email": "gabrielcastrog2@gmail.com",
}

app = FastAPI(title=title_project, description=description_project, contact=contact_project)
llm_service = LLMService()

class TextData(BaseModel):
    text: str
    lang: str

@app.get("/")
async def isrunning() -> dict:
    return {"message": "API is running"}

@app.post("/summarize")
async def summarize(data: TextData):
    llm_response = llm_service.summarize_text(text=data.text, lang=data.lang)
    return {"summary": llm_response}

