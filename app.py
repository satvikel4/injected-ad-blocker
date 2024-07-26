from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

openai.api_key = 'your-openai-api-key'

@app.route('/detect-ads', methods=['POST'])
def detect_ads():
    transcript = request.json['transcript']
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an AI trained to detect advertisements in video transcripts. Identify any ad sections and return their start and end timestamps."},
            {"role": "user", "content": f"Analyze this transcript and return ad timestamps:\n\n{transcript}"}
        ]
    )

    ad_timestamps = [[0, 30], [120, 150]]  # Example: ads from 0-30s and 120-150s
    
    return jsonify(ad_timestamps)

if __name__ == '__main__':
    app.run(debug=True)