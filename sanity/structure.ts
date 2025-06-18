import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('idea').title('Ideas'),
      S.documentTypeListItem('comment').title('Comments'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['idea', 'comment'].includes(item.getId()!),
      ),
    ])