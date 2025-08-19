import openai from './openaiClient';

/**
 * Analyzes email content for potential security threats using OpenAI
 * @param {Object} emailData - Email data to analyze
 * @returns {Promise<Object>} Threat analysis result
 */
export async function analyzeThreatContent(emailData) {
  try {
    const { sender, subject, content, attachments } = emailData;
    
    const analysisPrompt = `
Analyze this email for cybersecurity threats. Provide a structured assessment:

Email Details:
- From: ${sender}
- Subject: ${subject}
- Content: ${content || 'No content provided'}
- Attachments: ${attachments?.length > 0 ? attachments?.join(', ') : 'None'}

Analyze for:
1. Phishing indicators
2. Malware potential
3. Social engineering tactics
4. Suspicious links or domains
5. Overall threat level

Respond with a confidence score (0-100) and classification (safe, suspicious, phishing, malware).
`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a cybersecurity threat analyst. Analyze emails for potential security threats with high accuracy.' },
        { role: 'user', content: analysisPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'threat_analysis_response',
          schema: {
            type: 'object',
            properties: {
              classification: { type: 'string' },
              confidence: { type: 'number' },
              threatIndicators: { type: 'array', items: { type: 'string' } },
              explanation: { type: 'string' },
              riskLevel: { type: 'string' },
              recommendedAction: { type: 'string' }
            },
            required: ['classification', 'confidence', 'explanation', 'riskLevel'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error in threat analysis:', error);
    throw error;
  }
}

/**
 * Generates AI-powered security insights based on threat data trends
 * @param {Array} threatData - Historical threat data
 * @returns {Promise<Array>} Generated insights
 */
export async function generateSecurityInsights(threatData) {
  try {
    const dataSnapshot = {
      totalThreats: threatData?.length,
      phishingCount: threatData?.filter(t => t?.classification === 'phishing')?.length,
      malwareCount: threatData?.filter(t => t?.classification === 'malware')?.length,
      averageConfidence: threatData?.reduce((sum, t) => sum + t?.confidence, 0) / threatData?.length
    };

    const insightsPrompt = `
Based on the following cybersecurity data, generate 3 actionable insights:

Threat Summary:
- Total threats detected: ${dataSnapshot?.totalThreats}
- Phishing attempts: ${dataSnapshot?.phishingCount}
- Malware detected: ${dataSnapshot?.malwareCount}  
- Average confidence: ${dataSnapshot?.averageConfidence?.toFixed(1)}%

Generate insights focusing on:
1. Performance trends
2. Areas needing attention
3. Optimization opportunities

Each insight should have a type (trend, attention, optimization) and actionable recommendation.
`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a cybersecurity analyst generating actionable insights from threat data.' },
        { role: 'user', content: insightsPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'security_insights_response',
          schema: {
            type: 'object',
            properties: {
              insights: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    icon: { type: 'string' }
                  },
                  required: ['type', 'title', 'description', 'icon']
                }
              }
            },
            required: ['insights'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response?.choices?.[0]?.message?.content)?.insights;
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
}

/**
 * Classifies email content using OpenAI for real-time threat detection
 * @param {string} emailContent - Raw email content
 * @returns {Promise<Object>} Classification result
 */
export async function classifyEmailThreat(emailContent) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Classify emails as: safe, suspicious, phishing, or malware. Be precise and confident.' },
        { role: 'user', content: `Classify this email content: ${emailContent}` },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'email_classification',
          schema: {
            type: 'object',
            properties: {
              classification: { type: 'string' },
              confidence: { type: 'number' },
              reasoning: { type: 'string' }
            },
            required: ['classification', 'confidence', 'reasoning'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error classifying email:', error);
    throw error;
  }
}

/**
 * Generates detailed threat explanation for SOC analysis
 * @param {Object} threatData - Threat detection data
 * @returns {Promise<string>} Detailed explanation
 */
export async function generateThreatExplanation(threatData) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'Generate detailed technical explanations of cybersecurity threats for SOC analysts. Be specific and actionable.' 
        },
        { 
          role: 'user', 
          content: `Explain this threat detection in detail: ${JSON.stringify(threatData)}` 
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    console.error('Error generating threat explanation:', error);
    return 'Unable to generate detailed explanation at this time.';
  }
}