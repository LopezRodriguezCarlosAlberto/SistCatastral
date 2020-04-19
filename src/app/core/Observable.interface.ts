import Observer from './Observer.interface';



export default interface Observable{

    addObserver(observer: Observer): void;

    removeObserver(observer: Observer): void;

    notify(): void;

}

