class ScoreManager {
    private score = 0
    private highScore = 0
    private static instance: ScoreManager
    private constructor() {
        this.score = 0
        this.highScore = localStorage.getItem('highScore')
            ? parseInt(localStorage.getItem('highScore') as string)
            : 0
    }

    public static getInstance(): ScoreManager {
        if (!ScoreManager.instance) {
            ScoreManager.instance = new ScoreManager()
        }
        return ScoreManager.instance
    }

    public getScore(): number {
        return this.score
    }

    public getHighScore(): number {
        return this.highScore
    }

    public increaseScore(amount: number) {
        this.score += amount
    }

    public resetScore() {
        this.score = 0
    }

    public setHighScore(score: number) {
        this.highScore = score
        localStorage.setItem('highScore', this.highScore.toString())
    }
}

export default ScoreManager
