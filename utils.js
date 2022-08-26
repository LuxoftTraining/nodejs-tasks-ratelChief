const pipe = (...fns) =>
  fns.reduceRight(
    (outer, inner) =>
      (...args) =>
        outer(inner(...args)),
  );

module.exports = {
  pipe,
};
