import State from './State'

class StateMachine {
    private initialState: string
    private state: string | null
    private possibleStates: { [state: string]: State }

    constructor(initialState: string, possibleStates: { [state: string]: State }) {
        this.initialState = initialState
        this.state = null
        this.possibleStates = possibleStates
        for (const state in this.possibleStates) {
            this.possibleStates[state].stateMachine = this
        }
    }

    public update(time: number, delta: number): void {
        if (this.state === null) {
            this.state = this.initialState
            this.possibleStates[this.state].enter()
        }

        this.possibleStates[this.state].execute(time, delta)
    }

    public transition(newState: string): void {
        if (this.state) {
            this.possibleStates[this.state].exit()
        }
        this.state = newState
        this.possibleStates[this.state].enter()
    }

    public getCurrentState(): string | null {
        return this.state
    }
}

export default StateMachine
