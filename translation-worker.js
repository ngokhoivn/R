// File translation-worker.js
self.onmessage = async (e) => {
    const { sentence, sourceLang, targetLang, apiKey } = e.data;
    
    try {
        const languageMap = {
            'vi-VN': 'Vietnamese',
            'en-US': 'English',
            'ja-JP': 'Japanese'
        };
        
        const sourceLanguage = languageMap[sourceLang] || 'Vietnamese';
        const targetLanguage = languageMap[targetLang] || 'English';

        const prompt = `Translate from ${sourceLanguage} to ${targetLanguage}:\n\n${sentence}`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 1024,
                }
            })
        });
        
        const data = await response.json();
        const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        postMessage(translatedText.trim());
    } catch (error) {
        postMessage(''); // Trả về rỗng nếu lỗi
    }
};
