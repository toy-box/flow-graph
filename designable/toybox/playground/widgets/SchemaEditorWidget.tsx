import React from 'react';
import { TreeNode, ITreeNode } from '@designable/core';
import { MonacoInput } from '@designable/react-settings-form';
import { convertTreeNodesToSchema } from '../../src/convert';

export interface ISchemaEditorWidgetProps {
  tree: TreeNode;
  onChange?: (tree: ITreeNode) => void;
}

const Parser = {
  designableFormName: 'Root',
  designableFieldName: 'DesignableField',
};

export const SchemaEditorWidget: React.FC<ISchemaEditorWidgetProps> = (
  props,
) => {
  return (
    <MonacoInput
      {...props}
      value={JSON.stringify(
        convertTreeNodesToSchema(props.tree, Parser),
        null,
        2,
      )}
      onChange={(value) => {
        // TODO:
        // props.onChange?.(transformToTreeNode(JSON.parse(value), Parser))
      }}
      language="json"
    />
  );
};
