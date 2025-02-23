'use client';
import { useRequest } from 'ahooks';
import { useContext, useState } from 'react';
import { Button, Input, Box, buttonClasses, Divider } from '@/lib/mui';
import IconButton from '@mui/joy/IconButton';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NextPage } from 'next';
import { apiInterceptors, newDialogue, postScenes } from '@/client/api';
import ModelSelector from '@/components/chat/header/model-selector';
import { ChatContext } from '@/app/chat-context';

type FormData = {
  query: string;
};

const Home: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { model, setModel } = useContext(ChatContext);
  const methods = useForm<FormData>();
  const { data: scenesList } = useRequest(async () => {
    const [, res] = await apiInterceptors(postScenes());
    return res ?? [];
  });

  const submit = async ({ query }: FormData) => {
    try {
      setIsLoading(true);
      methods.reset();
      const [, res] = await apiInterceptors(
        newDialogue({
          chat_mode: 'chat_normal',
        }),
      );
      if (res?.conv_uid) {
        router.push(`/chat?id=${res?.conv_uid}${model ? `&model=${model}` : ''}&initMessage=${query}`);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto h-full justify-center flex max-w-3xl flex-col gap-8 px-5 pt-6">
        <Box className="flex justify-center py-4">
          <ModelSelector
            size="lg"
            onChange={(newModel: string) => {
              setModel(newModel);
            }}
          />
        </Box>
        <div className="my-0 mx-auto">
          <Image
            src="/LOGO.png"
            alt="Revolutionizing Database Interactions with Private LLM Technology"
            width={856}
            height={160}
            className="w-full"
            unoptimized
          />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <Divider className="text-[#878c93]">Quick Start</Divider>
            <Box
              className="grid rounded-xl gap-2 lg:grid-cols-3 lg:gap-6"
              sx={{
                [`& .${buttonClasses.root}`]: {
                  color: 'var(--joy-palette-primary-solidColor)',
                  backgroundColor: 'var(--joy-palette-primary-solidBg)',
                  height: '52px',
                  '&: hover': {
                    backgroundColor: 'var(--joy-palette-primary-solidHoverBg)',
                  },
                },
                [`& .${buttonClasses.disabled}`]: {
                  cursor: 'not-allowed',
                  pointerEvents: 'unset',
                  color: 'var(--joy-palette-primary-plainColor)',
                  backgroundColor: 'var(--joy-palette-primary-softDisabledBg)',
                  '&: hover': {
                    backgroundColor: 'var(--joy-palette-primary-softDisabledBg)',
                  },
                },
              }}
            >
              {scenesList?.map((scene) => (
                <Button
                  key={scene['chat_scene']}
                  disabled={scene?.show_disable}
                  size="md"
                  variant="solid"
                  className="text-base rounded-none"
                  onClick={async () => {
                    const [, res] = await apiInterceptors(
                      newDialogue({
                        chat_mode: 'chat_normal',
                      }),
                    );
                    if (res?.conv_uid) {
                      router.push(`/chat?id=${res.conv_uid}${model ? `&model=${model}` : ''}&scene=${scene['chat_scene']}`);
                    }
                  }}
                >
                  {scene['scene_name']}
                </Button>
              ))}
            </Box>
          </div>
        </div>
        <div className="mt-6 mb-[10%] pointer-events-none inset-x-0 bottom-0 z-0 mx-auto flex w-full max-w-3xl flex-col items-center justify-center max-md:border-t xl:max-w-4xl [&>*]:pointer-events-auto">
          <form
            style={{
              maxWidth: '100%',
              width: '100%',
              position: 'relative',
              display: 'flex',
              marginTop: 'auto',
              overflow: 'visible',
              background: 'none',
              justifyContent: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
              height: '52px',
            }}
            onSubmit={(e) => {
              methods.handleSubmit(submit)(e);
            }}
          >
            <Input
              sx={{ width: '100%' }}
              variant="outlined"
              placeholder="Ask anything"
              endDecorator={
                <IconButton type="submit" disabled={isLoading}>
                  <SendRoundedIcon />
                </IconButton>
              }
              {...methods.register('query')}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
