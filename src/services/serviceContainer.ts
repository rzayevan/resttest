import { ContainerBuilder } from "node-dependency-injection";
import { TransactionService, TransactionServiceImpl } from "./transactionService";

let container = new ContainerBuilder();

export function initServices() {
    container.register(TransactionService.id.id, TransactionServiceImpl);
}

// eslint-disable-next-line 
export function getService<T> (serviceId: ServiceId<T>): T {
    return container.get(serviceId.id);
}

// eslint-disable-next-line 
export interface ServiceId<T> {
    id: string;
}

export { container };

export namespace TestAccess {
    export function setServiceContainer(test: ContainerBuilder) {
        container = test;
    }
}