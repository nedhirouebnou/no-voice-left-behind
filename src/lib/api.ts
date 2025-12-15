import { HRFlowProfile } from "@/types/profile";

interface AnalyzeAudioResponse {
    key?: string;
    name?: string;
    audio_analysis: Record<string, string | boolean | number | null>;
    [key: string]: any;
}

export async function analyzeAudio(
    profile: HRFlowProfile,
    questions: string[],
    audioFile: File
): Promise<Record<string, string | boolean | number | null>> {
    const url = "https://analyze-audio-432490263066.europe-west1.run.app/analyze_audio";

    const fields = questions.map((q) => {
        // Generate a simple key name from the question
        const name = q
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "");
        return { name, question: q };
    });

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("fields", JSON.stringify(fields));
    formData.append("profile", JSON.stringify(profile));

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data: AnalyzeAudioResponse = await response.json();

        // If the API returns the profile with audio_analysis, return that.
        // Otherwise fallback to the data itself if it matches the expected structure (flat response case logic if API changes, though docs say it respects profile arg)
        if (data.audio_analysis) {
            return data.audio_analysis;
        }

        // Fallback: If no audio_analysis key but data exists, check if it looks like the result
        return data as unknown as Record<string, string | boolean | number | null>;

    } catch (error) {
        console.error("Failed to analyze audio:", error);
        throw error;
    }
}
