import Ajv, { JSONSchemaType } from 'ajv'
import { validate } from 'jsonschema'
// import metaSchema from "json-schema-draft-2020-12/schema";
import { action, batch, define, observable } from '@formily/reactive'
import { IFieldMeta } from '@toy-box/meta-schema'

const bundle = {
  $id: 'https://json-schema.org/draft/2020-12/schema',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Core and Validation specifications meta-schema',
  $dynamicAnchor: 'meta',
  allOf: [
    {
      $ref: 'meta/core',
    },
    {
      $ref: 'meta/applicator',
    },
    {
      $ref: 'meta/unevaluated',
    },
    {
      $ref: 'meta/validation',
    },
    {
      $ref: 'meta/meta-data',
    },
    {
      $ref: 'meta/format-annotation',
    },
    {
      $ref: 'meta/content',
    },
  ],
  type: ['object', 'boolean'],
  properties: {
    definitions: {
      $comment:
        'While no longer an official keyword as it is replaced by $defs, this keyword is retained in the meta-schema to prevent incompatible extensions as it remains in common use.',
      type: 'object',
      additionalProperties: {
        $dynamicRef: '#meta',
      },
      default: {},
    },
    dependencies: {
      $comment:
        '"dependencies" is no longer a keyword, but schema authors should avoid redefining it to facilitate a smooth transition to "dependentSchemas" and "dependentRequired"',
      type: 'object',
      additionalProperties: {
        anyOf: [
          {
            $dynamicRef: '#meta',
          },
          {
            $ref: 'meta/validation#/$defs/stringArray',
          },
        ],
      },
    },
  },
  $defs: {
    'https://json-schema.org/draft/2020-12/meta/core': {
      $id: 'https://json-schema.org/draft/2020-12/meta/core',
      title: 'Core vocabulary meta-schema',
      $dynamicAnchor: 'meta',
      type: ['object', 'boolean'],
      properties: {
        $id: {
          type: 'string',
          format: 'uri-reference',
          $comment: 'Non-empty fragments not allowed.',
          pattern: '^[^#]*#?$',
        },
        $schema: {
          type: 'string',
          format: 'uri',
        },
        $anchor: {
          type: 'string',
          pattern: '^[A-Za-z_][-A-Za-z0-9._]*$',
        },
        $ref: {
          type: 'string',
          format: 'uri-reference',
        },
        $dynamicRef: {
          type: 'string',
          format: 'uri-reference',
        },
        $dynamicAnchor: {
          type: 'string',
          pattern: '^[A-Za-z_][-A-Za-z0-9._]*$',
        },
        $vocabulary: {
          type: 'object',
          propertyNames: {
            type: 'string',
            format: 'uri',
          },
          additionalProperties: {
            type: 'boolean',
          },
        },
        $comment: {
          type: 'string',
        },
        $defs: {
          type: 'object',
          additionalProperties: {
            $dynamicRef: '#meta',
          },
          default: {},
        },
      },
    },
    'https://json-schema.org/draft/2020-12/meta/applicator': {
      $id: 'https://json-schema.org/draft/2020-12/meta/applicator',
      title: 'Applicator vocabulary meta-schema',
      $dynamicAnchor: 'meta',
      type: ['object', 'boolean'],
      properties: {
        prefixItems: {
          $ref: '#/$defs/schemaArray',
        },
        items: {
          $dynamicRef: '#meta',
        },
        contains: {
          $dynamicRef: '#meta',
        },
        additionalProperties: {
          $dynamicRef: '#meta',
        },
        properties: {
          type: 'object',
          additionalProperties: {
            $dynamicRef: '#meta',
          },
          default: {},
        },
        patternProperties: {
          type: 'object',
          additionalProperties: {
            $dynamicRef: '#meta',
          },
          propertyNames: {
            format: 'regex',
          },
          default: {},
        },
        dependentSchemas: {
          type: 'object',
          additionalProperties: {
            $dynamicRef: '#meta',
          },
        },
        propertyNames: {
          $dynamicRef: '#meta',
        },
        if: {
          $dynamicRef: '#meta',
        },
        then: {
          $dynamicRef: '#meta',
        },
        else: {
          $dynamicRef: '#meta',
        },
        allOf: {
          $ref: '#/$defs/schemaArray',
        },
        anyOf: {
          $ref: '#/$defs/schemaArray',
        },
        oneOf: {
          $ref: '#/$defs/schemaArray',
        },
        not: {
          $dynamicRef: '#meta',
        },
      },
      $defs: {
        schemaArray: {
          type: 'array',
          minItems: 1,
          items: {
            $dynamicRef: '#meta',
          },
        },
      },
    },
    'https://json-schema.org/draft/2020-12/meta/unevaluated': {
      $id: 'https://json-schema.org/draft/2020-12/meta/unevaluated',
      title: 'Unevaluated applicator vocabulary meta-schema',
      $dynamicAnchor: 'meta',
      type: ['object', 'boolean'],
      properties: {
        unevaluatedItems: {
          $dynamicRef: '#meta',
        },
        unevaluatedProperties: {
          $dynamicRef: '#meta',
        },
      },
    },
    'https://json-schema.org/draft/2020-12/meta/validation': {
      $id: 'https://json-schema.org/draft/2020-12/meta/validation',
      title: 'Validation vocabulary meta-schema',
      $dynamicAnchor: 'meta',
      type: ['object', 'boolean'],
      properties: {
        multipleOf: {
          type: 'number',
          exclusiveMinimum: 0,
        },
        maximum: {
          type: 'number',
        },
        exclusiveMaximum: {
          type: 'number',
        },
        minimum: {
          type: 'number',
        },
        exclusiveMinimum: {
          type: 'number',
        },
        maxLength: {
          $ref: '#/$defs/nonNegativeInteger',
        },
        minLength: {
          $ref: '#/$defs/nonNegativeIntegerDefault0',
        },
        pattern: {
          type: 'string',
          format: 'regex',
        },
        maxItems: {
          $ref: '#/$defs/nonNegativeInteger',
        },
        minItems: {
          $ref: '#/$defs/nonNegativeIntegerDefault0',
        },
        uniqueItems: {
          type: 'boolean',
          default: false,
        },
        maxContains: {
          $ref: '#/$defs/nonNegativeInteger',
        },
        minContains: {
          $ref: '#/$defs/nonNegativeInteger',
          default: 1,
        },
        maxProperties: {
          $ref: '#/$defs/nonNegativeInteger',
        },
        minProperties: {
          $ref: '#/$defs/nonNegativeIntegerDefault0',
        },
        required: {
          $ref: '#/$defs/stringArray',
        },
        dependentRequired: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/stringArray',
          },
        },
        const: true,
        enum: {
          type: 'array',
          items: true,
        },
        type: {
          anyOf: [
            {
              $ref: '#/$defs/simpleTypes',
            },
            {
              type: 'array',
              items: {
                $ref: '#/$defs/simpleTypes',
              },
              minItems: 1,
              uniqueItems: true,
            },
          ],
        },
      },
      $defs: {
        nonNegativeInteger: {
          type: 'integer',
          minimum: 0,
        },
        nonNegativeIntegerDefault0: {
          $ref: '#/$defs/nonNegativeInteger',
          default: 0,
        },
        simpleTypes: {
          enum: [
            'array',
            'boolean',
            'integer',
            'null',
            'number',
            'object',
            'string',
          ],
        },
        stringArray: {
          type: 'array',
          items: {
            type: 'string',
          },
          uniqueItems: true,
          default: [],
        },
      },
    },
    'https://json-schema.org/draft/2020-12/meta/meta-data': {
      $id: 'https://json-schema.org/draft/2020-12/meta/meta-data',
      title: 'Meta-data vocabulary meta-schema',
      $dynamicAnchor: 'meta',
      type: ['object', 'boolean'],
      properties: {
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        default: true,
        deprecated: {
          type: 'boolean',
          default: false,
        },
        readOnly: {
          type: 'boolean',
          default: false,
        },
        writeOnly: {
          type: 'boolean',
          default: false,
        },
        examples: {
          type: 'array',
          items: true,
        },
      },
    },
    'https://json-schema.org/draft/2020-12/meta/format-annotation': {
      $id: 'https://json-schema.org/draft/2020-12/meta/format-annotation',
      title: 'Format vocabulary meta-schema for annotation results',
      $dynamicAnchor: 'meta',
      type: ['object', 'boolean'],
      properties: {
        format: {
          type: 'string',
        },
      },
    },
    'https://json-schema.org/draft/2020-12/meta/content': {
      $id: 'https://json-schema.org/draft/2020-12/meta/content',
      title: 'Content vocabulary meta-schema',
      $dynamicAnchor: 'meta',
      type: ['object', 'boolean'],
      properties: {
        contentMediaType: {
          type: 'string',
        },
        contentEncoding: {
          type: 'string',
        },
        contentSchema: {
          $dynamicRef: '#meta',
        },
      },
    },
  },
}

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
    return validate(this.panelJson, bundle).valid
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
    formWidget[name] = {
      type,
      //可走国际化用 <TextWidget />
      title: name,
      'x-validator': [],
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        layout: 'vertical',
        colon: false,
      },
      ...rest,
    }

    // 处理必填情况和极值
    if (required) {
      formWidget[name]['x-validator'].push({
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
        formWidget[name]['x-validator'].push({
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
      string: () => {
        if (name === 'description') {
          return 'Input.TextArea'
        } else return 'Input'
      },
    }

    if (options) {
      formWidget[name]['x-component'] = 'Select'
      formWidget[name].enum = options
    } else {
      formWidget[name]['x-component'] = setComponentAction[type]
    }

    // 处理所有属性的子节点
    // ['items','properties'].map((key)=>{
    //   let targetMeta = key ==='properties'? formWidget[name].properties : formWidget[name].items.properties
    //   targetMeta = Object.keys(targetMeta).reduce(
    //     (result, key) => {
    //       // 处理Formily title填写
    //       targetMeta[key].title = key
    //       result[key] = metaToSchema(targetMeta[key])
    //       return result
    //     },
    //     {}
    //   )
    // })

    if (properties) {
      formWidget[name].properties = formWidget[name].properties ?? {}
      formWidget[name].properties = Object.keys(properties).reduce(
        (result, key) => {
          result[key] = metaToSchema(formWidget[name].properties[key])
          return result
        },
        {}
      )
    }

    if (items) {
      formWidget[name].items = Object.keys(items.properties).reduce(
        (result, key) => {
          // formWidget[name].properties[key].title = key
          //todo
          // result[key] = metaToSchema(items.properties[key])
          return result
        },
        {}
      )
    }

    // if (items) {
    //   formWidget[name].items = items.map(item => {
    //     return metaToSchema(item)
    //   })
    // }
  })
  return formWidget
}

export function convertMetaToFormily(metaList: IFieldMeta[]) {
  const formilySchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        // 'x-component-props': {
        //   maxColumns: 2,
        // },
        properties: metaToSchema(metaList),
      },
    },
  }
  metaToSchema(metaList)

  // 处理数据类型和表单元素的映射
  if (formilySchema.type === 'number') {
    formilySchema.type = 'string'
    formilySchema['x-component'] = 'NumberPicker'
  } else if (formilySchema.type === 'string') {
    formilySchema['x-component'] = 'Input'
  }
}
