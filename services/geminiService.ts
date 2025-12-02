import { GoogleGenAI, Type } from "@google/genai";
import { ClassRoom, AIAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCapacity = async (classes: ClassRoom[]): Promise<AIAnalysisResult> => {
  try {
    const dataStr = JSON.stringify(classes);
    
    const prompt = `
      Atue como um gestor escolar experiente. Analise os dados de turmas abaixo e forneça um relatório curto e direto em formato JSON.
      Dados das turmas: ${dataStr}
      
      Regras:
      1. Calcule a ocupação geral.
      2. Identifique turmas com superotação (>90%) ou subutilização (<20%).
      3. Sugira ações práticas (ex: abrir nova turma, remanejar alunos).
      4. Defina o nível de alerta (low, medium, high).
      
      Retorne apenas o JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Resumo executivo da situação das vagas." },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de ações sugeridas."
            },
            alertLevel: { 
              type: Type.STRING, 
              enum: ["low", "medium", "high"],
              description: "Nível de urgência da situação."
            }
          },
          required: ["summary", "recommendations", "alertLevel"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }

    throw new Error("Resposta vazia da IA");
  } catch (error) {
    console.error("Erro na análise da IA:", error);
    return {
      summary: "Não foi possível analisar os dados no momento.",
      recommendations: ["Verifique a conexão com a API."],
      alertLevel: "low"
    };
  }
};
