import StateMachine from "./StateMachine";

abstract class State {
    public stateMachine: StateMachine
    abstract enter(): void
    abstract execute(time: number, delta: number): void
    abstract exit(): void
}

export default State