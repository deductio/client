import { PropsWithChildren } from "react"
import { Form } from "react-router-dom"

interface SmallFormProps {
    action: string
}

const SmallForm = (props: PropsWithChildren<SmallFormProps>) => {
    return <div className="rounded-lg bg-white shadow-inner shadow-2xl">
            <Form method="POST" action={props.action}>
                <div className="m-8 flex flex-col">
                    {props.children}
                </div>
            </Form>
        </div>
}

export default SmallForm;