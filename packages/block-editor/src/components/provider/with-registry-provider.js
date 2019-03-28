/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { withRegistry, createRegistry, RegistryProvider } from '@wordpress/data';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { storeConfig } from '../../store';
import applyMiddlewares from '../../store/middlewares';

const withRegistryProvider = createHigherOrderComponent( ( WrappedComponent ) => {
	return withRegistry( ( { useSubRegistry = true, registry, ...props } ) => {
		// Disable reason, this rule conflicts with the React hooks rule (no conditionals)
		// eslint-disable-next-line @wordpress/no-unused-vars-before-return
		const [ subRegistry, updateRegistry ] = useState( null );

		if ( ! useSubRegistry ) {
			return <WrappedComponent registry={ registry } { ...props } />;
		}

		useEffect( () => {
			const newRegistry = createRegistry( {}, registry );
			const store = newRegistry.registerStore( 'core/block-editor', storeConfig );
			// This should be removed after the refactoring of the effects to controls.
			applyMiddlewares( store );
			updateRegistry( newRegistry );
		}, [ registry ] );

		if ( ! subRegistry ) {
			return null;
		}

		return (
			<RegistryProvider value={ subRegistry }>
				<WrappedComponent registry={ subRegistry } { ...props } />
			</RegistryProvider>
		);
	} );
}, 'withRegistryProvider' );

export default withRegistryProvider;