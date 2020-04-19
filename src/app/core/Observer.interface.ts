import Observable from './Observable.interface';

export default interface Observer {

    update(subject: Observable, args: any);
}