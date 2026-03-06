// Mistral-7B Configuration via Hugging Face API
export const aiConfig = {
  model: 'mistralai/Mistral-7B-Instruct-v0.1',
  provider: 'huggingface',
  apiKey: process.env.HUGGING_FACE_API_KEY,
  baseUrl: 'https://api-inference.huggingface.co/models/',
  
  // Resume optimization prompt
  optimizationPrompt: (resume, jobDescription) => `
You are an expert resume writer and ATS (Applicant Tracking System) specialist.

Your task is to optimize the following resume to better match the job description while maintaining accuracy and authenticity.

ORIGINAL RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Please:
1. Identify key skills, keywords, and requirements from the job description
2. Rewrite the resume to highlight relevant skills and experience
3. Use similar language and keywords from the job posting where appropriate
4. Maintain all factual accuracy - do not fabricate experience
5. Improve quantifiable metrics and achievements where possible
6. Ensure proper formatting and ATS compatibility

Return the optimized resume in the same format as the original.
  `,
  
  // Job analysis prompt
  analysisPrompt: (jobDescription) => `
Analyze the following job description and extract:
1. Key skills required (technical and soft skills)
2. Years of experience needed
3. Technologies and tools mentioned
4. Responsibilities that highlight achievements
5. Nice-to-have qualifications

Format the response as JSON.

JOB DESCRIPTION:
${jobDescription}
  `,
  
  // Temperature and other parameters
  parameters: {
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 0.95,
  }
};

// Hugging Face API call
export async function callMistralAPI(prompt) {
  try {
    const response = await fetch(
      `${aiConfig.baseUrl}${aiConfig.model}`,
      {
        headers: {
          Authorization: `Bearer ${aiConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: prompt,
          parameters: aiConfig.parameters,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result[0]?.generated_text || '';
  } catch (error) {
    console.error('Error calling Mistral API:', error);
    throw error;
  }
}

export default aiConfig;
