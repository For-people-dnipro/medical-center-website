import type { Schema, Struct } from '@strapi/strapi';

export interface NewsHighlightBlock extends Struct.ComponentSchema {
  collectionName: 'components_news_highlight_blocks';
  info: {
    displayName: 'Highlight block';
  };
  attributes: {
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface NewsImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_news_image_blocks';
  info: {
    displayName: 'Image block';
  };
  attributes: {
    alt: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface NewsQuoteBlock extends Struct.ComponentSchema {
  collectionName: 'components_news_quote_blocks';
  info: {
    displayName: 'Quote block';
  };
  attributes: {
    author: Schema.Attribute.String;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface NewsTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_news_text_blocks';
  info: {
    displayName: 'Text block';
  };
  attributes: {
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'news.highlight-block': NewsHighlightBlock;
      'news.image-block': NewsImageBlock;
      'news.quote-block': NewsQuoteBlock;
      'news.text-block': NewsTextBlock;
    }
  }
}
