import Ajv, { JSONSchemaType } from 'ajv'
import { validate } from 'jsonschema'
// import metaSchema from "json-schema-draft-2020-12/schema";
import { action, batch, define, observable } from '@formily/reactive'
import { IFieldMeta } from '@toy-box/meta-schema'

export class ActionForm {
  panelJson: JSONSchemaType<any>

  constructor(props) {
    this.panelJson = props
  }

  makeObservable() {
    define(this, {
      isDataValid: action,
    })
  }
  get isDataValid() {
    return validate(this.panelJson, this.panelJson).valid
  }
}
