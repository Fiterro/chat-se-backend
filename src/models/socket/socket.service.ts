import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";

@Injectable()
export class SocketService {
    eventEmitter: Subject<[string, any[]]> = new Subject();

    constructor() {
    }

    emitEvent(event: string, args: any): void {
        this.eventEmitter.next([event, args]);
    }
}
