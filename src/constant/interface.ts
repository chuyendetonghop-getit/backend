// Định nghĩa type cho tham số config
interface UpdateUserOptions {
  new?: boolean;
  lean?: boolean;
  upsert?: boolean;
  rawResult?: boolean;
  runValidators?: boolean;
  strict?: boolean;
}
