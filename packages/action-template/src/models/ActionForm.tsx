import Ajv, { JSONSchemaType } from 'ajv'
import { validate } from 'jsonschema'
// import metaSchema from "json-schema-draft-2020-12/schema";
import { action, batch, define, observable } from '@formily/reactive'
import { ICallArgumentData } from '@toy-box/autoflow-core'
import { IFieldMeta } from '@toy-box/meta-schema'
import { networkJson, networkJsonSchema } from './schemaValidate'

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
    // (async function () {
    //   const metaSchema = await Bundler.get(`https://json-schema.org/draft/2020-12/schema`);
    //   const bundle = await Bundler.bundle(metaSchema);
    //   console.log(JSON.stringify(bundle, null, "  "));
    return validate(networkJson, networkJsonSchema).valid
    // }());
  }
}

export function isJSON(props) {
  try {
    JSON.parse(props)
    return true
  } catch (e) {
    return false
  }
}

export function convertJSONSchemaToFormily(schema) {
  const formilySchema = schema
  console.log('schema[123]', schema)
  // const { type, properties, items, ...rest } = schema;
  // const formilySchema = {
  //   ...rest,
  // [type === 'array' ? 'items' : 'properties']: {},
  // };
  // 处理数据类型和表单元素的映射
  if (formilySchema.type === 'number') {
    formilySchema.type = 'string'
    formilySchema['x-component'] = 'NumberPicker'
  } else if (formilySchema.type === 'string') {
    formilySchema['x-component'] = 'Input'
  }
  // else if(formilySchema.type === 'object') {

  // }

  // 添加 Formily 扩展属性和校验规则
  formilySchema['x-decorator'] = 'FormItem'
  formilySchema['x-rules'] = []

  // 处理必填情况
  if (
    formilySchema.required &&
    ['array', 'object'].includes(formilySchema.type)
  ) {
    formilySchema.required.map((item) => {
      formilySchema.properties[item]['required'] = true
    })
  }

  // 处理枚举值
  if (formilySchema.enum) {
    formilySchema.enumNames = formilySchema.enum
    formilySchema.enum = formilySchema.enum.map((value, index) => ({
      value,
      label: formilySchema.enumNames[index],
    }))
    formilySchema['x-component'] = 'Select'
  }

  // 处理联动
  if (formilySchema.dependencies) {
    formilySchema['x-reactions'] = formilySchema.dependencies
    delete formilySchema.dependencies
  }

  // 处理最大值和最小值
  if (formilySchema.maximum) {
    formilySchema['x-rules'].push({
      required: true,
      message: `必须小于等于${formilySchema.maximum}`,
    })
    formilySchema.maxLength = formilySchema.maximum
    delete formilySchema.maximum
  }
  if (formilySchema.minimum) {
    formilySchema['x-rules'].push({
      required: true,
      message: `必须大于等于${formilySchema.minimum}`,
    })
    formilySchema.minLength = formilySchema.minimum
    delete formilySchema.minimum
  }

  // 处理所有属性的子节点
  if (formilySchema.properties) {
    // formilySchema.properties
    formilySchema.properties = Object.keys(formilySchema.properties).reduce(
      (result, key) => {
        // 处理Formily title填写
        formilySchema.properties[key].title = key
        result[key] = convertJSONSchemaToFormily(formilySchema.properties[key])
        return result
      },
      {}
    )
  }

  return formilySchema
}

function metaToSchema(metaList: IFieldMeta[]) {
  const formWidget = {}
  metaList.map((meta) => {
    const {
      type,
      name,
      key,
      required,
      options,
      minLength,
      maxLength,
      minimum,
      maximum,
      properties,
      items,
      ...rest
    } = meta
    formWidget[key] = {
      type,
      //可走国际化用 <TextWidget />
      title: name,
      'x-validator': [],
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        layout: 'vertical',
        colon: false,
      },
      // ...rest,
    }

    // 处理必填情况和极值
    if (required) {
      formWidget[key]['x-validator'].push({
        triggerType: 'onBlur',
        required: true,
        // message: (
        //   <TextWidget>
        //     flowDesigner.flow.form.validator.required
        //   </TextWidget>
        // ),
      })
    }

    ;[minLength, maxLength, minimum, maximum].map((item) => {
      item &&
        formWidget[key]['x-validator'].push({
          triggerType: 'onBlur',
          required: true,
          // message: (
          //   <TextWidget>
          //     必须大于 + {variable}
          //   </TextWidget>
          // ),
        })
      // formWidget[name][item] = item
    })

    // 处理数据类型和表单元素的映射
    const setComponentAction = {
      number: 'NumberPicker',
      // string:
      string: (() => {
        if (key === 'description') {
          return 'Input.TextArea'
        } else return 'Input'
      })(),
    }

    if (options) {
      formWidget[key]['x-component'] = 'Select'
      formWidget[key].enum = options
    } else {
      formWidget[key]['x-component'] = setComponentAction[type]
      console.log('formWidget ---', type, setComponentAction[type])
    }

    // 处理所有属性的子节点
    if (properties) {
      formWidget[key].properties = metaToSchema(
        Object.keys(properties).map((key) => properties[key])
      )
    }

    if (items) {
      formWidget[key].items = {
        type: 'object',
        properties: metaToSchema(
          Object.keys(items.properties).map((key) => items.properties[key])
        ),
      }
    }
  })
  return formWidget
}

export function convertMetaToFormily(metaList: IFieldMeta[]) {
  const formilySchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        // 'x-component': 'FormGrid',
        // 'x-component-props': {
        //   maxColumns: 2,
        // },
        properties: metaToSchema(metaList),
      },
    },
  }
  metaToSchema(metaList)
  return formilySchema

  // // 处理数据类型和表单元素的映射
  // if (formilySchema.type === 'number') {
  //   formilySchema.type = 'string'
  //   formilySchema['x-component'] = 'NumberPicker'
  // } else if (formilySchema.type === 'string') {
  //   formilySchema['x-component'] = 'Input'
  // }
}

function objArrayToKeyValue(array) {
  return array.reduce((acc, { key, value }) => {
    acc[key] = value
    return acc
  }, {})
}

export function convertHttpFormilyToJson({ callArguments, ...rest }) {
  const { body, cookies, headers, parameters, ...restArguments } = callArguments
  const pathParameters = {},
    queryParameters = {}
  if (parameters) {
    parameters.map((item) => {
      const { key, value } = item
      if (item.type === 'Path') {
        pathParameters[value] = value
      } else if (item.type === 'Query') {
        queryParameters[key] = value
      }
    })
  }
  const objMap = { body, cookies, headers }
  const params = {}
  Object.keys(objMap).map((key) => {
    if (objMap[key] && objMap[key].length) {
      params[key] = objArrayToKeyValue(objMap[key])
    }
  })

  const result = {
    ...rest,
    callArguments: {
      ...restArguments,
      pathParameters,
      queryParameters,
      ...params,
    },
  }
  return result
}

function keyValueToObjArray(
  obj: Omit<
    ICallArgumentData,
    'method' | 'url' | 'contentType' | 'authorization'
  >,
  type?: 'Query' | 'Path'
) {
  return (
    obj &&
    Object.entries(obj).map(([key, value]) =>
      type ? { key, value, type } : { key, value }
    )
  )
}

export function converHttpJsonToFormily({ callArguments, ...rest }) {
  const {
    body,
    cookies,
    headers,
    pathParameters,
    queryParameters,
    ...restArguments
  } = callArguments
  const parameters = [
    ...keyValueToObjArray(pathParameters, 'Path'),
    ...keyValueToObjArray(pathParameters, 'Query'),
  ]
  return {
    ...rest,
    callArguments: {
      ...restArguments,
      parameters,
      body: keyValueToObjArray(body),
      cookies: keyValueToObjArray(cookies),
      headers: keyValueToObjArray(headers),
    },
  }
}
