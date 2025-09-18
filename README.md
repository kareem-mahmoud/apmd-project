# ApmdProject

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



## Project Architecture and State Management

This application is built with Angular and leverages a modern, reactive architecture, primarily driven by Angular Signals for efficient state management.

### Architecture Overview
The project follows a feature-based and layout-based organization:
-   **`src/app/features/`**: Contains core application features like `product-item`, `cart`, and `favorites`. Each feature is self-contained with its own component, template, and styles.
-   **`src/app/layout/`**: Houses shared UI components, such as the `header`, which are used across the application.
-   **`src/app/core/services/`**: Centralizes application-wide services, including data fetching (`ProductsService`) and persistent client-side storage (`StorageService`).

### State Management with Angular Signals
The application's state, particularly for user-specific data like favorites and cart items, is managed reactively using Angular Signals:
-   **`StorageService`**: This service acts as the single source of truth for `localStorage` interactions.
    -   It uses `signal<number[]>` (`favoriteIds`, `cartItemIds`) to store the IDs of favorited and cart items.
    -   These signals are initialized from `localStorage` upon service creation.
    -   An Angular `effect` is used to automatically persist any changes to `favoriteIds` or `cartItemIds` back to `localStorage`, ensuring data persistence across sessions.
    -   `computed` signals (`favoritesCount`, `cartCount`) provide derived state (e.g., the total number of items) that automatically updates when the base signals change.
-   **Component Interaction**:
    -   Components like `ProductItem`, `Cart`, and `Favorites` `inject` the `StorageService`.
    -   They use `computed` signals (e.g., `isFavorite`, `isInCart` in `ProductItem`, `cartProducts`, `favoriteProducts` in `Cart` and `Favorites`) to reactively display data. This means the UI automatically updates whenever the underlying `StorageService` signals change, without manual subscriptions or `ngOnInit` re-runs for state updates.
    -   The `Cart` and `Favorites` pages use `toObservable` and `toSignal` from `@angular/core/rxjs-interop` to bridge the reactive `StorageService` signals with RxJS observables for fetching product details via `ProductsService`.

## Performance Optimizations

Several strategies have been employed to enhance application performance:
-   **Angular Signals**: By enabling fine-grained reactivity, Signals minimize unnecessary change detection cycles, leading to more efficient rendering and better performance, especially in complex UIs.
-   **`isPlatformBrowser` Guard**: Access to `localStorage` is guarded by `isPlatformBrowser(this.platformId)` within `StorageService`. This prevents `ReferenceError` during server-side rendering (SSR) and ensures that `localStorage` operations only occur in a browser environment, improving initial load times and preventing errors in non-browser contexts.
-   **`@for` with `track`**: All `@for` loops in templates use `track product.id` to help Angular efficiently update the DOM by identifying unique items, reducing re-rendering costs when lists change.
-   **Conditional Badge Rendering**: `matBadgeHidden="favoritesCount() === 0"` and `matBadgeHidden="cartCount() === 0"` ensure that the Material Design badges are only rendered when there are actual items to count, avoiding unnecessary DOM elements.
-   **Reactive Data Loading (`startWith`)**: In `Cart` and `Favorites` components, `startWith({ isLoading: true, products: [] })` is used within RxJS pipelines. This immediately provides a loading state, improving perceived performance by showing a spinner while product data is being fetched.

## Possible Improvements

This project can be further enhanced with the following improvements:
-   **Quantity Management in Cart**: Currently, the cart only stores product IDs. Extend `StorageService` to store product quantities (e.g., `Map<number, number>`) to allow users to add multiple units of the same item.
-   **"Remove from Favorites" Button**: Add a dedicated button on the Favorites page to allow users to easily remove items from their favorites list.
-   **Global Loading Indicator**: Implement a global loading indicator or progress bar for API calls that affect the entire application.
-   **User Authentication & Backend Integration**: Integrate with a backend API for user authentication, and persist user-specific favorites and cart data on the server.
-   **Advanced Error Handling**: Implement more user-friendly error messages and retry mechanisms for failed API requests.
-   **Filtering, Sorting, and Pagination**: Add functionality to filter, sort, and paginate products on the main product listing, favorites, and cart pages.
-   **Accessibility Enhancements**: Further improve ARIA attributes, keyboard navigation, and focus management for a more inclusive user experience.
-   **Unit and Integration Tests**: Develop comprehensive unit tests for services and components, and integration tests for feature flows.
-   **Theming**: Implement dynamic theming options to allow users to switch between different visual themes.
