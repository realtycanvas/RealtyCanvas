import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {table} from '@sanity/table'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'RealtyCanvas-blog',
  title: 'RealtyCanvas Blog',

  projectId: '5pondglc',
  dataset: 'production',

  plugins: [structureTool(), table(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})