import { Role } from '@prisma/client';

/**
 * Verifica se um usuário pode alterar o status de outro com base nas roles.
 * @param actorRole A role do usuário que tenta fazer a alteração.
 * @param targetRole A role do usuário cujo status está sendo alterado.
 * @returns true se a alteração é permitida, false caso contrário.
 */
export function canDoIt(actorRole: Role, targetRole: Role): boolean {
    const actorPriority = RolePriority[actorRole];
    const targetPriority = RolePriority[targetRole];

    if (actorPriority > 1) return false; //Apenas Roles 0 e 1 podem modificar Roles

    // Um usuário pode alterar o status de outro se sua prioridade for menor (maior poder).
    return actorPriority < targetPriority;
}
const RolePriority: { [key in Role]: number } = {
    [Role.ADMIN]: 0,
    [Role.EVENT_MANAGER]: 1,
    [Role.STAFF]: 2,
    [Role.SPECTATOR]: 3
};