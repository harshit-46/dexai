import axios from "axios";

const API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;

export const generateCodeStream = async (prompt) => {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'mistral-large-latest',
            messages: [{ role: 'user', content: prompt }],
            stream: true
        })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Mistral API error: ${text}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    return {
        async *[Symbol.asyncIterator]() {
            let buffer = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                for (let line of lines) {
                    line = line.trim();
                    if (!line.startsWith("data:")) continue;
                    const jsonStr = line.replace("data: ", "");
                    if (jsonStr === "[DONE]") return;
                    try {
                        const parsed = JSON.parse(jsonStr);
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) yield content;
                    } catch (e) {
                        console.warn("⚠️ Stream parse error:", e.message);
                    }
                }
                buffer = lines[lines.length - 1];
            }
        }
    };
};

export const generateCode = async (prompt, options = {}) => {
    const {
        maxTokens = 512,
        temperature = 0.7,
        model = 'mistral-large-latest',
        fallbackModel = 'mistral-small',
        maxRetries = 2,
        retryDelay = 3000
    } = options;

    let currentModel = model;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await axios.post(
                'https://api.mistral.ai/v1/chat/completions',
                {
                    model: currentModel,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: maxTokens,
                    temperature,
                },
                {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log("Response is: ", response);
            return response.data.choices[0].message.content.trim();
        } catch (err) {
            const status = err.response?.status;
            const errorMsg = err.response?.data?.message || err.message;
            if (status === 429 && currentModel === model) {
                console.warn(`⚠️ Model ${model} hit capacity. Falling back to ${fallbackModel}...`);
                currentModel = fallbackModel;
                await new Promise((res) => setTimeout(res, retryDelay));
                continue;
            }
            if (status === 429 && attempt < maxRetries) {
                console.warn(`⏳ Retrying attempt ${attempt}...`);
                await new Promise((res) => setTimeout(res, retryDelay));
                continue;
            }
            console.error(`🔥 Mistral API error (${status}):`, errorMsg);
            return `// Error generating code: ${errorMsg}`;
        }
    }
    return "// All attempts failed. Please try again later.";
};


/*

// utils/mistral.js - Complete enhanced version

// Configuration
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.REACT_APP_GOOGLE_CSE_ID;
const MISTRAL_API_KEY = process.env.REACT_APP_MISTRAL_API_KEY;

// Google Search API Integration
class GoogleSearchAPI {
    constructor(apiKey, cseId) {
        this.apiKey = apiKey;
        this.cseId = cseId;
        this.baseUrl = "https://www.googleapis.com/customsearch/v1";
        this.cache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
    }

    async search(query, numResults = 5) {
        if (!this.apiKey || !this.cseId) {
            console.warn('Google Search API not configured - add REACT_APP_GOOGLE_API_KEY and REACT_APP_GOOGLE_CSE_ID to .env');
            return null;
        }

        // Check cache first
        const cacheKey = `${query}-${numResults}`;
        const cached = this.cache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
            console.log('🔍 Using cached search results for:', query);
            return cached.data;
        }

        const params = new URLSearchParams({
            key: this.apiKey,
            cx: this.cseId,
            q: query,
            num: Math.min(numResults, 10),
            safe: 'active'
        });

        try {
            console.log(`🔍 Searching Google for: "${query}"`);
            const response = await fetch(`${this.baseUrl}?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Search API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(`Google API Error: ${data.error.message}`);
            }
            
            // Cache the results
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            const resultCount = data.items?.length || 0;
            console.log(`✅ Found ${resultCount} search results`);
            return data;
        } catch (error) {
            console.error('❌ Google Search API error:', error);
            return null;
        }
    }

    clearCache() {
        this.cache.clear();
        console.log('🗑️ Search cache cleared');
    }
}

// Enhanced prompt analyzer
class PromptAnalyzer {
    static shouldUseWebSearch(prompt) {
        const searchTriggers = [
            // Time-sensitive keywords
            'latest', 'recent', 'new', 'current', 'today', 'now', '2024', '2025',
            'trending', 'popular', 'updated', 'modern', 'contemporary', 'fresh',
            
            // Comparison keywords
            'best', 'top', 'compare', 'vs', 'versus', 'better', 'difference',
            'alternatives', 'options', 'choose', 'recommend', 'which', 'what should i use',
            
            // Learning keywords
            'tutorial', 'guide', 'how to', 'learn', 'example', 'documentation',
            'reference', 'manual', 'course', 'training', 'walkthrough', 'step by step',
            
            // Technology keywords
            'framework', 'library', 'tool', 'package', 'version', 'release',
            'update', 'changelog', 'features', 'performance', 'benchmark', 'npm',
            
            // Problem-solving keywords
            'error', 'bug', 'issue', 'problem', 'fix', 'solution', 'troubleshoot',
            'debug', 'optimize', 'improve', 'performance', 'faster', 'efficient',
            
            // Development keywords
            'deployment', 'hosting', 'production', 'build', 'setup', 'configuration',
            'integration', 'api', 'database', 'security', 'authentication'
        ];

        const lowerPrompt = prompt.toLowerCase();
        const triggerCount = searchTriggers.filter(trigger => 
            lowerPrompt.includes(trigger)
        ).length;

        // Use search if multiple triggers or specific patterns
        return triggerCount >= 1 || /\b(how do i|what's the|tell me about)\b/i.test(lowerPrompt);
    }

    static createSearchQuery(prompt) {
        // Clean up the prompt
        let searchQuery = prompt
            .replace(/^(create|generate|write|build|make|show me|give me)\s+/i, '')
            .replace(/^(a|an|the)\s+/i, '')
            .replace(/\?+$/, '')
            .trim();

        // Add current year for time-sensitive queries
        const currentYear = new Date().getFullYear();
        const needsYear = /\b(best|latest|current|new|modern|trending|recent)\b/i.test(prompt);
        
        if (needsYear && !searchQuery.includes(currentYear.toString())) {
            searchQuery += ` ${currentYear}`;
        }

        // Add programming context if not present
        const programmingTerms = [
            'code', 'programming', 'development', 'javascript', 'python', 'react', 
            'api', 'framework', 'library', 'nodejs', 'frontend', 'backend',
            'web development', 'software', 'coding'
        ];
        
        const hasProgContext = programmingTerms.some(term => 
            searchQuery.toLowerCase().includes(term)
        );
        
        if (!hasProgContext) {
            // Determine context based on prompt content
            if (/\b(react|vue|angular|svelte)\b/i.test(prompt)) {
                searchQuery += ' frontend development';
            } else if (/\b(node|express|api|server|backend)\b/i.test(prompt)) {
                searchQuery += ' backend development';
            } else if (/\b(python|django|flask)\b/i.test(prompt)) {
                searchQuery += ' python programming';
            } else {
                searchQuery += ' programming development';
            }
        }

        // Add tutorial/guide context for how-to questions
        if (/\b(how to|how do i|tutorial|guide)\b/i.test(prompt)) {
            searchQuery += ' tutorial guide';
        }

        return searchQuery.trim();
    }

    static extractKeywords(prompt) {
        const keywords = prompt
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 10);
        
        return keywords;
    }
}

// Enhanced context formatter
class SearchResultFormatter {
    static formatForAI(searchResults) {
        if (!searchResults?.items?.length) {
            return '';
        }

        let context = '🌐 **Recent Web Information Found:**\n\n';
        
        searchResults.items.slice(0, 5).forEach((item, index) => {
            const title = item.title || 'No title';
            const snippet = item.snippet || 'No description';
            const source = item.displayLink || 'Unknown source';
            const link = item.link || '';
            
            // Clean up snippet
            const cleanSnippet = snippet
                .replace(/\s+/g, ' ')
                .replace(/\.\.\./g, '')
                .trim();
            
            context += `**Source ${index + 1}: ${title}**\n`;
            context += `From: ${source}\n`;
            context += `Info: ${cleanSnippet}\n`;
            if (link) context += `URL: ${link}\n`;
            context += '\n';
        });

        context += '---\n\n';
        return context;
    }

    static extractCodeExamples(searchResults) {
        if (!searchResults?.items?.length) return [];
        
        const codeExamples = [];
        searchResults.items.forEach(item => {
            const snippet = item.snippet || '';
            // Look for code-like patterns in snippets
            const codeMatches = snippet.match(/```[\s\S]*?```|`[^`]*`/g);
            if (codeMatches) {
                codeExamples.push({
                    source: item.title,
                    code: codeMatches
                });
            }
        });
        
        return codeExamples;
    }
}

// Initialize Google Search
const googleSearch = new GoogleSearchAPI(GOOGLE_API_KEY, GOOGLE_CSE_ID);

// Enhanced generateCodeStream function
export async function* generateCodeStream(prompt, options = {}) {
    const { 
        signal, 
        enableWebSearch = true, 
        maxSearchResults = 5, 
        model = 'mistral-small-latest',
        temperature = 0.7,
        maxTokens = 4000
    } = options;
    
    try {
        let enhancedPrompt = prompt;
        let searchContext = '';
        let searchUsed = false;

        // Step 1: Decide if we need web search
        const shouldSearch = enableWebSearch && 
                           GOOGLE_API_KEY && 
                           GOOGLE_CSE_ID && 
                           PromptAnalyzer.shouldUseWebSearch(prompt);
        
        if (shouldSearch) {
            console.log('🔍 Web search enabled for this prompt');
            
            // Step 2: Create optimized search query
            const searchQuery = PromptAnalyzer.createSearchQuery(prompt);
            console.log(`🔍 Search query: "${searchQuery}"`);
            
            // Step 3: Perform web search
            const searchResults = await googleSearch.search(searchQuery, maxSearchResults);
            
            if (searchResults?.items?.length) {
                searchContext = SearchResultFormatter.formatForAI(searchResults);
                searchUsed = true;
                
                // Step 4: Enhanced prompt with search results
                enhancedPrompt = `${searchContext}

Based on the above recent web information and your comprehensive programming knowledge, please help with this request:

${prompt}

**Instructions:**
1. Combine the web information with your expertise for the most accurate answer
2. If using recent information from the web, mention it naturally in your response
3. Provide practical, working code examples with clear explanations
4. Include relevant best practices and modern approaches
5. Format all code blocks properly with appropriate language specification
6. Be specific and actionable in your recommendations`;

                console.log('✅ Search results integrated into prompt');
            } else {
                console.log('⚠️ No useful search results found, using AI knowledge only');
            }
        } else {
            console.log('ℹ️ Web search not needed for this prompt');
        }

        // Step 5: Make the API call to Mistral
        if (!MISTRAL_API_KEY) {
            throw new Error('MISTRAL_API_KEY not found. Please add it to your .env file.');
        }

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system', 
                        content: `You are an expert programming assistant and code companion. You provide accurate, practical, and well-explained solutions to programming problems. When you have access to recent web information, integrate it naturally into your responses. Always format code properly and explain your reasoning.`
                    },
                    {
                        role: 'user', 
                        content: enhancedPrompt
                    }
                ],
                stream: true,
                max_tokens: maxTokens,
                temperature: temperature
            }),
            signal
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Mistral API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // Step 6: Stream the response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        console.log('🤖 Streaming AI response...');

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                console.log('✅ Stream completed');
                break;
            }
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    
                    if (data === '[DONE]') {
                        return;
                    }
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;
                        
                        if (content) {
                            yield content;
                        }
                    } catch (parseError) {
                        // Skip invalid JSON chunks
                        continue;
                    }
                }
            }
        }

    } catch (error) {
        console.error('❌ Enhanced code generation error:', error);
        
        // Provide helpful error messages
        if (error.message.includes('MISTRAL_API_KEY')) {
            throw new Error('Mistral API key not configured. Please add REACT_APP_MISTRAL_API_KEY to your .env file.');
        } else if (error.message.includes('401')) {
            throw new Error('Invalid Mistral API key. Please check your REACT_APP_MISTRAL_API_KEY in .env file.');
        } else if (error.message.includes('429')) {
            throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
        } else if (error.name === 'AbortError') {
            throw error; // Let the component handle abort errors
        } else {
            throw new Error(`Code generation failed: ${error.message}`);
        }
    }
}

// Utility functions
export async function getSearchSuggestions(query, maxResults = 3) {
    if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
        console.warn('Google Search not configured for suggestions');
        return [];
    }

    try {
        const results = await googleSearch.search(query, maxResults);
        return results?.items?.map(item => ({
            title: item.title,
            snippet: item.snippet,
            link: item.link,
            source: item.displayLink
        })) || [];
    } catch (error) {
        console.error('Error getting search suggestions:', error);
        return [];
    }
}

export function clearSearchCache() {
    googleSearch.clearCache();
}

export function isSearchConfigured() {
    return !!(GOOGLE_API_KEY && GOOGLE_CSE_ID);
}

export function isMistralConfigured() {
    return !!MISTRAL_API_KEY;
}

// Export classes for advanced usage
export { 
    GoogleSearchAPI, 
    PromptAnalyzer, 
    SearchResultFormatter,
    googleSearch 
};


*/ 