# Edgio Examples

This repository is a collection of all example sites and applications powered by Edgio!

## Checkout Examples

To checkout all available example apps, clone this repository:

```
  git clone git@github.com:edgio-docs/edgio-examples.git
```

## Preparing Examples

Due to the number of examples, it is recommended to _only_ install dependencies for the example you are working on.

Whether you want to create a new example or modify an existing one, there is an `examples` script to help with either case.

Start by running:

```
  npm run examples
```

This will prompt to create a new example from the existing template or modify an existing example.

### New Example

When creating a new example, the name entered is the path to be created under the `./examples` path. For instance, if you enter `my-example`, the path will be `./examples/my-example`.

This will copy the base template from `_template`, install the dependencies, and automatically update Edgio to the latest version.

Once completed, change into the directory of the new example to continue.

### Existing Example

Modifying an existing example is as simple as entering the name of the example you want to modify. You may also type to filter the list of choices.

Once selected, the dependencies will be installed. This step does not automatically update the Edgio version for an existing example. If desired, update the example using `edgio use latest`.
