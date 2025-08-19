import openai from './openaiClient';

/**
 * Generates performance analysis insights for AI models
 * @param {Object} performanceData - Model performance metrics
 * @returns {Promise<Object>} Performance insights
 */
export async function analyzeModelPerformance(performanceData) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'Analyze AI model performance metrics and provide actionable insights for cybersecurity applications.' 
        },
        { 
          role: 'user', 
          content: `Analyze these model performance metrics: ${JSON.stringify(performanceData)}. Focus on accuracy, response time, and throughput improvements.` 
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'performance_analysis',
          schema: {
            type: 'object',
            properties: {
              overallAssessment: { type: 'string' },
              topPerformer: { type: 'string' },
              recommendations: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              optimizationOpportunities: { 
                type: 'array', 
                items: { 
                  type: 'object',
                  properties: {
                    model: { type: 'string' },
                    suggestion: { type: 'string' },
                    expectedImpact: { type: 'string' }
                  }
                }
              }
            },
            required: ['overallAssessment', 'topPerformer', 'recommendations'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error analyzing model performance:', error);
    throw error;
  }
}

/**
 * Generates correlation analysis between different security metrics
 * @param {Array} correlationData - Metric correlation data
 * @returns {Promise<Object>} Correlation insights
 */
export async function analyzeCorrelations(correlationData) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'Analyze correlations between cybersecurity metrics and identify key relationships that impact security posture.' 
        },
        { 
          role: 'user', 
          content: `Analyze these metric correlations: ${JSON.stringify(correlationData)}. Identify significant relationships and their security implications.` 
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'correlation_analysis',
          schema: {
            type: 'object',
            properties: {
              strongestCorrelation: { type: 'string' },
              weakestCorrelation: { type: 'string' },
              securityImplications: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              actionableInsights: { 
                type: 'array', 
                items: { type: 'string' } 
              }
            },
            required: ['strongestCorrelation', 'securityImplications'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error analyzing correlations:', error);
    throw error;
  }
}

/**
 * Generates real-time threat pattern analysis
 * @param {Array} threatPatterns - Real-time threat data patterns
 * @returns {Promise<string>} Pattern analysis summary
 */
export async function analyzeThreatPatterns(threatPatterns) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'Analyze real-time cybersecurity threat patterns and identify emerging risks or anomalies.' 
        },
        { 
          role: 'user', 
          content: `Analyze these threat patterns and identify any concerning trends: ${JSON.stringify(threatPatterns)}` 
        },
      ],
      temperature: 0.2,
      max_tokens: 200,
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    console.error('Error analyzing threat patterns:', error);
    return 'Pattern analysis unavailable at this time.';
  }
}