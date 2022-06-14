import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	console.log(data);
	return json(data);
};

export default function form() {
	const response = useActionData();
	return (
		<div>
			<h1>form example</h1>
			<Form method="post">
				<input type="text" name="firstName" placeholder="John" />
				<input type="text" name="lastName" placeholder="Smith" />
				<button type="submit">Submit</button>
				{!!response && (
					<>
						<hr />
						<h2>submittion response</h2>
						<pre>{JSON.stringify(response, null, "  ")}</pre>
					</>
				)}
			</Form>
		</div>
	);
}
