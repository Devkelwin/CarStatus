import {createRealmContext,} from '@realm/react'
import { Historic } from './schemas/Historic'
import {SyncConfiguration,FlexibleSyncConfiguration} from 'realm'
const realmAcessBehavior: Realm.OpenRealmBehaviorConfiguration = {
    type: Realm.OpenRealmBehaviorType.OpenImmediately,
  }

export const syncConfig: any = {
    flexible: true,
    newRealmFileBehavior: realmAcessBehavior,
    existingRealmFileBehavior: realmAcessBehavior
}
export const {
    RealmProvider,
    useRealm,
    useQuery,
    useObject
} = createRealmContext({
    schema: [Historic]
})