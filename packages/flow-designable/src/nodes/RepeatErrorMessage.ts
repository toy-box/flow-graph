import {
  FlowMetaParam,
  FlowMetaParamOfType,
  IFieldMetaFlow,
  IResourceParam,
} from '@toy-box/autoflow-core'
import { IResourceMetaflow } from '../interface'

export interface RepeatErrorMessagePorps {
  metaFlow?: IResourceMetaflow
  apiId: string
}

export class RepeatErrorMessage {
  metaFlowDatas: FlowMetaParamOfType[] = []
  metaFlow: IResourceMetaflow
  apiId: string
  errorMessage: string | null = null
  metaFlowData: FlowMetaParam | IFieldMetaFlow | undefined
  apiReg: RegExp | undefined

  constructor(
    metaFlow: IResourceMetaflow,
    apiId: string,
    metaFlowData: FlowMetaParam | IFieldMetaFlow | undefined,
    apiReg?: RegExp
  ) {
    this.metaFlow = metaFlow
    this.apiId = apiId
    this.metaFlowData = metaFlowData
    this.apiReg = apiReg
    this.init(metaFlow)
  }

  init = (metaFlow: IResourceMetaflow) => {
    this.metaFlowDatas = []
    metaFlow.metaResourceDatas.forEach((data: any) => {
      if (data?.children?.length > 0) this.metaFlowDatas.push(...data.children)
    })
    this.metaFlowDatas.push(...metaFlow.metaFlowDatas)
    this.metaFlowDatas.push(...metaFlow.shortCutDatas)
    this.errorMessageFunc()
  }

  errorMessageFunc = () => {
    if (this.apiReg?.test(this.apiId)) {
      if (this.apiId.length <= 32) {
        this.errorMessage = 'flowDesigner.flow.form.validator.repeatName'
        const idx = this.metaFlowDatas.findIndex(
          (meta: any) => meta.id === this.apiId || meta?.key === this.apiId
        )
        const metaFlowData: any = this.metaFlowData
        if (metaFlowData?.id === this.apiId || metaFlowData?.key === this.apiId)
          return (this.errorMessage = null)
        if (idx <= -1) this.errorMessage = null
      } else {
        this.errorMessage = 'flowDesigner.flow.form.validator.apiLength'
      }
    } else {
      this.errorMessage =
        'flowDesigner.flow.form.validator.resourceRegRuleMessage'
    }
  }
}
