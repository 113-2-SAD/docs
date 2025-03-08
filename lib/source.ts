import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { createOpenAPI } from "fumadocs-openapi/server";
import { createElement } from 'react';
import { icons } from 'lucide-react';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon) {
      // You may set a default icon
      return;
    }
 
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});
export const openapi = createOpenAPI();