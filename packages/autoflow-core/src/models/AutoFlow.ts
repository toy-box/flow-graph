import { FlowModeEnum } from '@toy-box/flow-graph'
import { FlowType } from '../types'
import { FlowModeType } from './MetaFlow'

export abstract class AutoFlow {
  registers: any[] = []

  initRegisters(data: any[]) {
    this.registers = data
  }
}
