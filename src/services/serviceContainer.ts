import { ContainerBuilder } from "node-dependency-injection";
import { TransactionService, TransactionServiceImpl } from "./transactionService";

let container = new ContainerBuilder();

/**
 * All services must be added to this container to get registered
 */
export function initServices() {
    container.register(TransactionService.id.id, TransactionServiceImpl);
}

export function getService<T> (serviceId: ServiceId<T>): T {
    return container.get(serviceId.id);
}

export interface ServiceId<T> {
    id: string;
}

export { container };