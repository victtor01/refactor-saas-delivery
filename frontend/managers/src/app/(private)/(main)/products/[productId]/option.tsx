import {
  Control,
  useFieldArray,
  useFormContext,
  UseFormRegister,
} from "react-hook-form";
import { BiMinus } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";

export const OptionComponent = ({
  nestIndex,
}: {
  nestIndex: number;
}) => {
  const context = useFormContext();

  const { fields, remove, append } = useFieldArray({
    control: context.control,
    name: `topics[${nestIndex}].topicOptions`,
  });

  const { register } = context;

  return (
    <section
      className="flex flex-col px-4 border-l-[0.2rem] border-gray-300 
    dark:border-orange-700"
    >
      <div className="flex flex-col gap-2">
        {fields.map((item, k) => {
          return (
            <div key={item.id} className="flex gap-4 items-center">
              <input
                className="p-2 bg-white shadow outline-none border-2 border-transparent 
              focus:border-orange-500 rounded font-semibold dark:bg-zinc-700 dark:bg-opacity-40"
                {...register(`topics.${nestIndex}.topicOptions.${k}.name`)}
                placeholder="Cream cheese"
              />

              <input
                className="p-2 bg-white shadow outline-none border-2 border-transparent 
              focus:border-emerald-500 rounded font-semibold dark:bg-zinc-700 dark:bg-opacity-40"
                {...register(`topics.${nestIndex}.topicOptions.${k}.price`)}
                placeholder="30"
              />

              <button
                type="button"
                onClick={() => remove(k)}
                className="w-8 h-8 grid place-items-center bg-gray-300 text-white
              rounded-md opacity-90 hover:opacity-100 hover:bg-rose-500
              dark:bg-zinc-700"
              >
                <BiMinus />
              </button>
            </div>
          );
        })}

        <footer>
          <button
            type="button"
            className="border-2 border-dashed px-4 p-2 opacity-80 flex items-center gap-3
          hover:opacity-100 rounded-md dark:border-zinc-600 dark:text-gray-300 bg-white
          dark:bg-zinc-800"
            onClick={() =>
              append({
                id: null,
                price: "",
                name: "",
              })
            }
          >
            <PiPlus />
            Criar nova opção
          </button>
        </footer>
      </div>
    </section>
  );
};
