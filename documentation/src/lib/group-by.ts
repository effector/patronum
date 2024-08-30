type Item = {
  [key: string]: any; // Allows any properties as the structure is dynamic
};

type GroupedItem<T, K> = {
  group: K;
  items: T[];
};

export function groupBy<T extends Item>(
  list: T[],
  key: keyof T,
): GroupedItem<T, typeof key>[] {
  const groupedObject: { [key: string]: T[] } = list.reduce((result, currentItem) => {
    const groupKey = currentItem[key] as string;

    // Initialize the group if it doesn't exist
    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    // Push the current item into the group
    result[groupKey].push(currentItem);

    return result;
  }, {} as { [key: string]: T[] });

  // Convert the grouped object into the desired array format
  return Object.keys(groupedObject).map((group) => ({
    group: group,
    items: groupedObject[group],
  }));
}
